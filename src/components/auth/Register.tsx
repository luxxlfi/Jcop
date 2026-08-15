"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { Label } from "../ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const { data, error, } = await supabase.auth.signUp({
      email,
      password,
      
    });

    setLoading(false);

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);
    router.push("/profile");
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-950">
      {/* LEFT */}
      <main className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="text-2xl font-bold tracking-tight">Jcop</div>

        <div className="mx-auto w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Buat akun Anda
            </h1>
            <p className="text-slate-500">
              Rasakan masa depan pertumbuhan profesional hari ini.
            </p>
          </div>

          {/* {FORM} */}

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
              className="h-10 w-full bg-red-600 text-white hover:bg-red-700"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : " Daftar Sekarang "}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Atau lanjutkan dengan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2">
              Google
            </Button>

            <Button variant="outline" className="gap-2">
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-950 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>

        <footer className="text-center text-xs text-slate-500">
          © 2024 Jcop. Dilindungi oleh keamanan kelas dunia.
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
            <h2 className="text-4xl font-bold tracking-tight">
              Mulai Perjalanan Karier Anda
            </h2>

            <p className="mx-auto max-w-md text-lg text-slate-600">
              Bergabunglah dengan 20,000+ profesional untuk menemukan peluang
              terbaik.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
