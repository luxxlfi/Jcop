"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CvRow = {
  id: string;
  title: string;
  raw_text: string | null;
  updated_at: string;
};

export default function CVClient({
  userId,
  initialCv,
}: {
  userId: string;
  initialCv: CvRow | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [cvId, setCvId] = useState<string | null>(initialCv?.id ?? null);
  const [title, setTitle] = useState(initialCv?.title ?? "CV Saya");
  const [rawText, setRawText] = useState(initialCv?.raw_text ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [review, setReview] = useState<any>(null);

  const onSave = async () => {
    setLoading(true);
    setMsg(null);
    setError(null);

    if (!rawText.trim()) {
      setLoading(false);
      setError("CV masih kosong.");
      return;
    }

    if (cvId) {
      const { error } = await supabase
        .from("cvs")
        .update({
          title,
          raw_text: rawText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cvId);

      setLoading(false);
      if (error) return setError(error.message);

      setMsg("CV berhasil diupdate.");
      router.refresh();
      return;
    }

    const { data, error } = await supabase
      .from("cvs")
      .insert({
        user_id: userId,
        title,
        raw_text: rawText,
      })
      .select("id")
      .single();

    setLoading(false);
    if (error) return setError(error.message);

    setCvId(data.id);
    setMsg("CV berhasil disimpan.");
    router.refresh();
  };

  const onRefine = async () => {
    if (!cvId) {
      setAiError("Simpan CV dulu sebelum refine.");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    const res = await fetch("/api/ai/refine-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvId }),
    });

    const json = await res.json();
    setAiLoading(false);

    if (!res.ok) {
      setAiError(json.error ?? "Gagal refine");
      return;
    }

    setReview(json.review);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">CV</h1>

          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {msg && <p className="mt-3 text-sm text-emerald-600">{msg}</p>}

        <div className="mt-6 space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="CV Saya"
          />
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="rawText">Isi CV (paste text)</Label>
          <textarea
            id="rawText"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste CV kamu di sini..."
            className="min-h-[320px] w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
          />
        </div>
        <Button onClick={onRefine} disabled={aiLoading} variant="outline">
          {aiLoading ? "Refining..." : "Refine AI"}
        </Button>
      </div>

      {aiError && <p className="text-sm text-red-600">{aiError}</p>}

      {review?.improved_text && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Hasil CV (AI)</h2>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-800">
            {review.improved_text}
          </pre>
        </div>
      )}
    </div>
  );
}
