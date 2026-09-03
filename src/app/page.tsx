import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, FileCheck, ArrowRight, ShieldCheck, Zap, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            <span className="text-red-600">J</span>cop
          </span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            CV AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-700 hover:text-zinc-900 hover:bg-slate-100">
              Masuk
            </Button>
          </Link>
          <Link href="/cv">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 shadow-md shadow-red-600/20">
              Refisi CV Sekarang
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="order-2 flex items-center justify-center px-6 py-16 lg:order-1 sm:px-10 lg:px-20">
          <div className="w-full max-w-2xl space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-xs">
              <span className="mr-2 text-sm font-semibold text-red-600">New</span>
              <span className="text-xs text-gray-600 sm:text-sm font-medium">
                Next-gen AI CV & Resume Optimizer
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-zinc-900">
                Optimalkan CV Kamu
              </h1>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-red-600 sm:text-5xl lg:text-6xl">
                dengan AI
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Tingkatkan peluang kerja kamu. Jcop CV AI menganalisis resume secara mendalam, memberikan masukan skor ATS, tata bahasa, dan perbaikan wording instan.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <Link href="/cv">
                <Button
                  className="h-14 w-full sm:w-auto rounded-xl bg-red-600 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-700 px-8"
                >
                  Refisi CV Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-14 w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-8 text-lg font-medium text-black shadow-xs transition-all duration-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="relative order-1 min-h-[420px] overflow-hidden bg-contain bg-center bg-no-repeat lg:order-2 lg:min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-slate-50/50"
          style={{
            backgroundImage: "url('/hero.png')",
          }}
        >
          {/* AI Match Score Card */}
          <div
            className="
              absolute
              left-4 top-10
              sm:left-10 sm:top-16
              lg:left-16 lg:top-28

              rounded-2xl
              border border-white/80
              bg-white/90
              p-5
              backdrop-blur-xl
              ring-1 ring-black/5
              shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              transition-all duration-500
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              ATS Readiness Score
            </p>

            <h2 className="mt-1 text-4xl font-extrabold text-red-600">
              96%
            </h2>

            <div className="mt-3 h-2.5 w-36 rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-red-500 to-red-700" />
            </div>
          </div>

          {/* Resume Analysis */}
          <div
            className="
              absolute
              right-4 top-12
              sm:right-10 sm:top-16
              lg:right-16 lg:top-24

              flex items-center gap-3
              rounded-2xl
              border border-white/80
              bg-white/90
              px-5 py-4
              backdrop-blur-xl
              ring-1 ring-black/5
              shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              transition-all duration-500
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <FileCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-zinc-900">Analisis Wording</p>
              <p className="text-xs font-medium text-emerald-600">✓ Perbaikan Instan</p>
            </div>
          </div>

          {/* Recommended ATS Keywords */}
          <div
            className="
              absolute
              bottom-12
              right-4
              sm:right-10
              lg:right-16
              rounded-2xl
              border border-white/80
              bg-white/90
              p-5
              backdrop-blur-xl
              ring-1 ring-black/5
              shadow-[0_20px_50px_rgba(0,0,0,0.12)]
              transition-all duration-500
              hover:-translate-y-1 hover:shadow-xl
              max-w-xs
            "
          >
            <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Kata Kunci ATS Disarankan
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">+ Project Management</span>
              <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">+ Leadership</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <section className="py-16 bg-slate-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Fitur Keunggulan Refisi CV AI
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Semua yang kamu butuhkan untuk menghasilkan CV yang ATS-friendly dan menarik recruiter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Analisis Koreksi Lengkap</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mendeteksi kesalahan tata bahasa, frasa pasif, serta informasi penting yang terlewat dalam CV kamu.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Saran Wording & Dampak</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mengubah deskripsi pengalaman biasa menjadi kalimat berorientasi hasil yang berdampak tinggi.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Optimasi Kata Kunci ATS</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mendapatkan rekomendasi kata kunci industri yang relevan agar CV kamu lolos screening ATS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Jcop CV AI — Platform Refisi CV & Resume AI.</p>
      </footer>
    </div>
  );
}


