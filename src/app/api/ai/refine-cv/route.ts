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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cvId } = await req.json().catch(() => ({ cvId: null }));
  if (!cvId) return NextResponse.json({ error: "cvId wajib diisi" }, { status: 400 });

  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("id, raw_text")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (cvError || !cv) return NextResponse.json({ error: "CV tidak ditemukan" }, { status: 404 });

  const raw = (cv.raw_text ?? "").trim();
  if (!raw) return NextResponse.json({ error: "CV kosong" }, { status: 400 });

  // (opsional) biar gak kepanjangan
  const cvText = raw.length > 12000 ? raw.slice(0, 12000) : raw;

  const prompt = `
Kamu adalah reviewer CV (auditor), bukan penulis ulang CV.

Tugas:
- BERI NILAI kualitas CV 0-100 (semakin tinggi semakin bagus).
- Berikan koreksi/temuan yang jelas dan actionable.
- Jangan menulis ulang CV. Jangan menghasilkan versi "improved CV".
- Jangan mengarang fakta baru.

Output HARUS JSON valid SAJA (tanpa markdown, tanpa teks tambahan) dengan format persis:

{
  "score": 70,
  "summary": "Ringkasan singkat kualitas CV (1-2 kalimat).",
  "strengths": ["poin bagus 1", "poin bagus 2"],
  "issues": [
    {
      "title": "Masalah utama",
      "severity": "low|medium|high",
      "detail": "penjelasan masalah",
      "how_to_fix": "cara benerinnya"
    }
  ],
  "wording_warnings": [
    {
      "phrase": "kata/kalimat yang tidak cocok",
      "why": "kenapa tidak cocok",
      "better": "alternatif lebih profesional"
    }
  ],
  "missing_sections": ["Bagian yang seharusnya ada tapi tidak ada"],
  "ats_keywords_missing": ["keyword penting yang kemungkinan kurang (berdasarkan CV)"]
}

CV yang direview:
${cvText}
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
        temperature: 0.2, // lebih stabil buat JSON
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

    // rate limit / provider error -> coba model berikutnya
    if (orRes.status === 429 || orRes.status >= 500) continue;

    // error lain -> stop
    return NextResponse.json({ error: lastErrText }, { status: lastStatus });
  }

  if (!content) {
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

  // Kalau gagal parse JSON, tetep simpen raw biar bisa kamu debug
  const result = parsed ?? { raw: content };

  // Simpen ke cv_reviews: improved_text dikosongin (karena kamu gak mau rewrite)
  const { data: saved, error: saveError } = await supabase
    .from("cv_reviews")
    .insert({
      cv_id: cv.id,
      user_id: user.id,
      improved_text: null,
      result: { ...result, _used_model: usedModel },
    })
    .select("id, improved_text, result, created_at")
    .single();

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  return NextResponse.json({ review: saved, usedModel });
}