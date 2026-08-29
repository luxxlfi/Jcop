import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function tryParseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return tryParseJson(text.slice(start, end + 1));
}

function getModels() {
  const raw =
    process.env.OPENROUTER_MODELS ??
    process.env.OPENROUTER_MODEL ??
    "google/gemma-4-26b-a4b-it:free";

  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cvId } = await req.json().catch(() => ({ cvId: null }));

  if (!cvId) {
    return NextResponse.json({ error: "cvId wajib diisi" }, { status: 400 });
  }

  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("id, raw_text")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (cvError || !cv) {
    return NextResponse.json({ error: "CV tidak ditemukan" }, { status: 404 });
  }

  const raw = (cv.raw_text ?? "").trim();
  if (!raw) {
    return NextResponse.json({ error: "CV kosong" }, { status: 400 });
  }

  const prompt = `
Kamu adalah asisten karier.
Rapikan CV berikut agar lebih profesional untuk lamaran kerja.

Aturan:
- Jangan mengarang fakta baru.
- Boleh perbaiki struktur, bahasa, dan bullet points.
- Output HARUS JSON valid (tanpa markdown) dengan format:

{
  "improved_text": "CV versi rapih (text)",
  "suggestions": ["saran 1", "saran 2"],
  "keywords": ["keyword 1", "keyword 2"]
}

CV:
${raw}
  `.trim();

  const models = getModels();
  if (models.length === 0) {
    return NextResponse.json(
      { error: "OPENROUTER_MODELS/OPENROUTER_MODEL belum diset" },
      { status: 500 }
    );
  }

  let content: string | undefined;
  let usedModel: string | null = null;

  let lastStatus = 500;
  let lastErrText = "";

  for (const model of models) {
    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_NAME ?? "Jcop",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    if (orRes.ok) {
      const orJson = await orRes.json();
      content = orJson?.choices?.[0]?.message?.content;
      usedModel = model;
      if (content) break;
      lastStatus = 500;
      lastErrText = "AI response kosong";
      continue;
    }

    lastStatus = orRes.status;
    lastErrText = await orRes.text();

    // kalau rate limit / server provider error -> coba model berikutnya
    if (orRes.status === 429 || orRes.status >= 500) continue;

    // error lain (400/401/403) biasanya bukan “penuh”, jadi stop
    return NextResponse.json({ error: lastErrText }, { status: lastStatus });
  }

  if (!content) {
    // semua model gagal / penuh
    const status = lastStatus === 429 ? 429 : 503;
    return NextResponse.json(
      {
        error:
          status === 429
            ? "Semua model gratis sedang rate-limited. Coba lagi nanti."
            : "Model gratis sedang bermasalah. Coba lagi nanti.",
        detail: lastErrText,
      },
      { status }
    );
  }

  const parsed = tryParseJson(content) ?? extractJsonObject(content);
  const improvedText = parsed?.improved_text ?? content;
  const result = parsed ?? { raw: content };

  const { data: saved, error: saveError } = await supabase
    .from("cv_reviews")
    .insert({
      cv_id: cv.id,
      user_id: user.id,
      improved_text: improvedText,
      result: { ...result, _used_model: usedModel },
    })
    .select("id, improved_text, result, created_at")
    .single();

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  return NextResponse.json({ review: saved, usedModel });
}