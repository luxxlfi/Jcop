"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

export default function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/cv");
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-950">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* LEFT */}
      <main className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-red-600">J</span>cop
        </Link>

        <div className="mx-auto w-full max-w-[400px] space-y-8 my-auto py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Buat Akun Baru
            </h1>
            <p className="text-slate-500 text-sm">
              Mulai tingkatkan kualitas CV dan resume kamu menggunakan kecerdasan buatan.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="********"
              />
              <p className="text-xs text-slate-500">Minimal 8 karakter.</p>
            </div>

            <Button
              className="h-10 w-full bg-red-600 text-white hover:bg-red-700 font-semibold rounded-xl"
              type="submit"
              disabled={loading}
            >
              {loading ? "Mendaftarkan..." : "Daftar Akun Baru"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-red-600 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>

        <footer className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Jcop CV AI. Hak cipta dilindungi.
        </footer>
      </main>

      {/* RIGHT */}
      <section className="hidden w-1/2 flex-col items-center justify-center bg-slate-50 lg:flex">
        <div className="relative w-full max-w-lg space-y-12 px-8 text-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src="/hero.png"
              alt="Karakter 3D Jcop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-12"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
              Mulai Perjalanan Anda
            </h2>

            <p className="mx-auto max-w-md text-base text-slate-600">
              Daftar dalam 10 detik dan optimalkan CV kamu untuk siap melamar pekerjaan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


