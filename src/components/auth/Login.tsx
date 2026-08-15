"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (signInError) {
      setErrorMsg("pasword / email tidak sesuai");

      setTimeout(() => {
        setErrorMsg(null);
      }, 5000);

      return;
    }

    console.log(data);
    setErrorMsg(null);
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-950">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
          {errorMsg}
        </div>
      )}
      {/* LEFT */}
      <main className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="text-2xl font-bold tracking-tight">Jcop</div>

        <div className="mx-auto w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Masuk</h1>
            <p className="text-slate-500">
              Tingkatkan lintasan karier Anda dengan presisi AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2">
              Google
            </Button>

            <Button variant="outline" className="gap-2">
              LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Atau gunakan email
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-red-600"
              />

              <Label htmlFor="remember" className="text-sm text-slate-500">
                Ingat saya selama 30 hari
              </Label>
            </div>

            <Button
              className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
              type="submit"
            >
              Masuk
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-slate-950 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>

        <footer className="hidden justify-between text-xs text-slate-500 sm:flex">
          <span>© 2024 Jcop. Hak cipta dilindungi.</span>

          <nav className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:underline">
              Syarat & Ketentuan
            </Link>
          </nav>
        </footer>
      </main>
      {/* RIGHT */}
      <section className="hidden w-1/2 flex-col items-center justify-center bg-slate-50 lg:flex">
        <div className="relative w-full max-w-lg space-y-12 px-8 text-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl ">
            <Image
              src="/hero.png"
              alt="Karakter 3D Jcop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-12"
              priority
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Selamat Datang Kembali
            </h2>

            <p className="mx-auto max-w-md text-lg text-slate-600">
              Wawasan yang dipersonalisasi, peluang eksklusif, dan akselerasi
              karier berbasis data menanti Anda.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <BadgeDot color="bg-red-600" text="AI Matching" />
            <BadgeDot color="bg-emerald-500" text="Salary Insights" />
            <BadgeDot color="bg-amber-500" text="Exclusive Roles" />
          </div>
        </div>
      </section>
    </div>
  );
}

function BadgeDot({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium shadow-sm">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {text}
    </div>
  );
}
