"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  AlertCircle,
  Check,
  Tag,
  ThumbsUp,
  ArrowRight,
  Zap,
  Info,
} from "lucide-react";

/* ---------- Types ---------- */

type CvRow = {
  id: string;
  title: string;
  raw_text: string | null;
  updated_at: string;
};

type Issue = {
  title?: string;
  severity?: "low" | "medium" | "high" | string;
  detail?: string;
  how_to_fix?: string;
};

type WordingWarning = {
  phrase?: string;
  why?: string;
  better?: string;
};

export type ReviewResult = {
  score?: number | string;
  summary?: string;
  strengths?: string[];
  issues?: Issue[];
  wording_warnings?: WordingWarning[];
  missing_sections?: string[];
  ats_keywords_missing?: string[];
  raw?: string;
  _used_model?: string;
};

export type ReviewRow = {
  id: string;
  improved_text: string | null;
  result: ReviewResult | null;
  created_at: string;
};

/* ---------- Helpers ---------- */

function clampScore(v: unknown): number | null {
  const n =
    typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreStyle(score: number) {
  if (score >= 80)
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      bar: "bg-emerald-500",
      label: "Sangat Bagus & ATS Ready",
    };
  if (score >= 60)
    return {
      text: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      bar: "bg-amber-500",
      label: "Cukup Baik (Perlu Dipoles)",
    };
  return {
    text: "text-red-600",
    bg: "bg-red-50 border-red-200",
    bar: "bg-red-600",
    label: "Memerlukan Banyak Perbaikan",
  };
}

function severityBadge(sev?: string) {
  switch ((sev ?? "").toLowerCase()) {
    case "high":
      return "border-red-200 bg-red-50 text-red-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}

function severityLabel(sev?: string) {
  switch ((sev ?? "").toLowerCase()) {
    case "high":
      return "Prioritas Tinggi";
    case "medium":
      return "Sedang";
    case "low":
      return "Ringan";
    default:
      return sev || "Info";
  }
}

/* ---------- Component ---------- */

export default function CVClient({
  userId,
  initialCv,
  initialReview = null,
}: {
  userId: string;
  initialCv: CvRow | null;
  initialReview?: ReviewRow | null;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [cvId, setCvId] = useState<string | null>(initialCv?.id ?? null);
  const [title, setTitle] = useState(initialCv?.title ?? "CV Saya");
  const [rawText, setRawText] = useState(initialCv?.raw_text ?? "");
  const [savedText, setSavedText] = useState(initialCv?.raw_text ?? "");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewRow | null>(initialReview);

  const hasUnsavedChanges = rawText !== savedText;
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  /* ----- Simpan CV ----- */
  const onSave = async () => {
    setLoading(true);
    setMsg(null);
    setError(null);

    if (!rawText.trim()) {
      setLoading(false);
      setError("Isi CV masih kosong. Silakan masukkan teks CV Anda.");
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

      setSavedText(rawText);
      setMsg("CV berhasil diperbarui.");
      router.refresh();
      return;
    }

    const { data, error } = await supabase
      .from("cvs")
      .insert({ user_id: userId, title, raw_text: rawText })
      .select("id")
      .single();

    setLoading(false);
    if (error) return setError(error.message);

    setCvId(data.id);
    setSavedText(rawText);
    setMsg("CV berhasil disimpan.");
    router.refresh();
  };

  /* ----- Scan CV pakai AI ----- */
  const onScan = async () => {
    setAiError(null);

    if (!cvId) {
      setAiError("Simpan CV terlebih dahulu sebelum melakukan scan AI.");
      return;
    }

    if (hasUnsavedChanges) {
      setAiError("Ada perubahan yang belum disimpan. Klik Simpan terlebih dahulu.");
      return;
    }

    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/refine-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });

      const json = await res.json();

      if (!res.ok) {
        setAiError(json.error ?? "Gagal memproses scan CV.");
        return;
      }

      setReview(json.review as ReviewRow);
    } catch {
      setAiError("Gagal menghubungi server AI.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-red-600" />
            Studio Refisi CV AI
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola teks CV kamu dan dapatkan analisis mendalam berbasis Artificial Intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cvId && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Tersimpan
            </span>
          )}
        </div>
      </div>

      {/* ===== Editor CV Card ===== */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Editor Title & Save Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Judul CV / Dokumen
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: CV Software Engineer 2026"
              className="font-bold text-lg border-none p-0 focus-visible:ring-0 shadow-none h-auto text-zinc-900"
            />
          </div>

          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 shadow-xs shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan CV
              </>
            )}
          </Button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {msg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Textarea Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rawText" className="text-sm font-semibold text-slate-700">
              Isi Konten CV (Copy & Paste Teks CV Kamu)
            </Label>
            <span className="text-xs text-slate-400">
              {wordCount} Kata | {charCount} Karakter
            </span>
          </div>
          <textarea
            id="rawText"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Pastekan teks lengkap CV Anda di sini (Pengalaman Kerja, Pendidikan, Keahlian, Proyek, dll)..."
            className="min-h-[360px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-100 font-sans text-zinc-900"
          />
        </div>

        {/* AI Trigger Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-slate-400 shrink-0" />
            {hasUnsavedChanges ? (
              <span className="text-amber-600 font-medium">
                Ada perubahan belum disimpan. Klik Simpan sebelum melakukan scan.
              </span>
            ) : (
              <span>Sistem AI akan menganalisis skor ATS, tata bahasa, dan saran revisi secara komprehensif.</span>
            )}
          </p>

          <Button
            onClick={onScan}
            disabled={aiLoading || !rawText.trim() || hasUnsavedChanges}
            variant="outline"
            className="rounded-xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-6 py-5 shadow-xs"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin text-red-600" />
                Sedang Menganalisis CV...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5 text-red-600" />
                Scan & Refisi CV dengan AI
              </>
            )}
          </Button>
        </div>

        {aiError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}
      </div>

      {/* ===== Hasil Scan Section ===== */}
      {review?.result && <ReviewResultView review={review} />}
    </div>
  );
}

/* ---------- Tampilan Hasil Review Detail ---------- */

function ReviewResultView({ review }: { review: ReviewRow }) {
  const r = review.result ?? {};
  const score = clampScore(r.score);

  if (score === null && r.raw) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900">Hasil Scan Mentah</h2>
        <p className="mt-1 text-sm text-slate-500">
          Format tanggapan AI disajikan dalam teks mentah:
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-100 overflow-x-auto">
          {r.raw}
        </pre>
      </div>
    );
  }

  const style = scoreStyle(score ?? 0);
  const issues = r.issues ?? [];
  const wording = r.wording_warnings ?? [];
  const missing = r.missing_sections ?? [];
  const strengths = r.strengths ?? [];
  const atsMissing = r.ats_keywords_missing ?? [];

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Laporan Refisi & Review AI
        </h2>
      </div>

      {/* Skor & Executive Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
              Score Readiness ATS
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Ringkasan Evaluasi</h3>
            {r.summary && (
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {r.summary}
              </p>
            )}
          </div>

          <div className={`rounded-2xl p-6 border ${style.bg} text-center min-w-[200px] shrink-0`}>
            <div className={`text-6xl font-black tracking-tight ${style.text}`}>
              {score ?? 0}
              <span className="text-2xl font-bold">%</span>
            </div>
            <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${style.text}`}>
              {style.label}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Kualitas CV saat ini</span>
            <span>{score ?? 0} / 100</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${style.bar} transition-all duration-700 ease-out`}
              style={{ width: `${score ?? 0}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 border-t border-gray-100 pt-3">
          Dianalisis pada {new Date(review.created_at).toLocaleString("id-ID")}
          {r._used_model ? ` · Model: ${r._used_model}` : ""}
        </p>
      </div>

      {/* Koreksi / Kekurangan */}
      {issues.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-bold text-zinc-900">
              Koreksi &amp; Hal yang Perlu Diperbaiki ({issues.length})
            </h3>
          </div>

          <div className="grid gap-4">
            {issues.map((it, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-slate-50/60 p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-zinc-900 text-base">
                    {it.title ?? "Catatan Perbaikan"}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityBadge(
                      it.severity
                    )}`}
                  >
                    {severityLabel(it.severity)}
                  </span>
                </div>

                {it.detail && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {it.detail}
                  </p>
                )}

                {it.how_to_fix && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                      <Zap className="h-4 w-4" /> Cara Memperbaiki:
                    </p>
                    <p className="leading-relaxed">{it.how_to_fix}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saran Wording & Frasa */}
      {wording.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-zinc-900">
              Rekomendasi Wording &amp; Refisi Kalimat ({wording.length})
            </h3>
          </div>

          <div className="grid gap-4">
            {wording.map((w, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-slate-50/60 p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                  {w.phrase && (
                    <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 font-mono text-red-700 line-through">
                      ✗ {w.phrase}
                    </span>
                  )}
                  {w.phrase && w.better && <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />}
                  {w.better && (
                    <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-mono text-emerald-700 font-semibold">
                      ✓ {w.better}
                    </span>
                  )}
                </div>
                {w.why && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">Alasan: </span>
                    {w.why}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Bagian Terlewat & Kata Kunci ATS */}
      {(missing.length > 0 || atsMissing.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {missing.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-bold text-zinc-900">Bagian yang Terlewat</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {missing.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {atsMissing.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-500" />
                <h3 className="text-base font-bold text-zinc-900">Rekomendasi Kata Kunci ATS</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {atsMissing.map((k, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kelebihan */}
      {strengths.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-zinc-900">Poin Kelebihan CV Saat Ini</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {strengths.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-slate-700"
              >
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}