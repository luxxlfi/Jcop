import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <div className=" order-2 flex items-center justify-center px-6 py-16 lg:order-1 sm:px-10 lg:px-20">
        <div className="w-full max-w-2xl space-y-6 lg:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <span className="mr-2 text-sm font-semibold text-red-500">New</span>
            <span className="text-xs text-gray-600 sm:text-sm">
              Next-gen AI Job Matching is Live
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Find Your Dream
            </h1>

            <h1 className="text-4xl font-extrabold leading-tight text-red-500 sm:text-5xl lg:text-6xl">
              Career with AI
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-xl text-base leading-7 text-gray-500 sm:text-lg sm:leading-8">
            Stop searching and start discovering. Jcop leverages advanced
            machine learning to match your unique skill set with high-impact
            career opportunities at the world's most innovative companies.
          </p>

          {/* Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Link href="/login">
              <Button
                variant="destructive"
                className="h-14 rounded-xl bg-black px-10 text-lg text-white shadow-md transition-all duration-300 hover:bg-zinc-700"
              >
                Get Started
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-14 rounded-xl border border-gray-300 bg-white px-10 text-lg font-medium text-black shadow-sm transition-all duration-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500 hover:shadow-lg"
            >
              Explore Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="relative order-1 min-h-[420px] overflow-hidden bg-contain bg-center bg-no-repeat lg:order-2 lg:min-h-screen"
        style={{
          backgroundImage: "url('/hero.png')",
        }}
      >
        {/* AI Match Score */}
        <div
          className="
      absolute
      left-4 top-10
      sm:left-10 sm:top-16
      lg:left-16 lg:top-32

      rounded-2xl
      border border-white/40
      bg-white/80
      p-5
      backdrop-blur-xl
      ring-1 ring-black/5

      shadow-[0_30px_70px_rgba(0,0,0,0.22)]

      transition-all
      duration-500

      [transform:rotateX(55deg)_rotateZ(-6deg)]
      hover:-translate-y-2
      hover:scale-105
      hover:shadow-[0_40px_90px_rgba(0,0,0,0.30)]
      hover:[transform:rotateX(0deg)_rotateZ(0deg)]
    "
        >
          <p className="text-xs font-medium text-zinc-700 sm:text-sm">
            AI Match Score
          </p>

          <h2 className="mt-1 text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            96%
          </h2>

          <div className="mt-4 h-3 w-32 rounded-full bg-zinc-200 sm:w-40">
            <div className="h-3 w-[96%] rounded-full bg-gradient-to-r from-red-500 to-red-700" />
          </div>
        </div>

        {/* Resume Analysis */}
        <div
          className="
      absolute
      right-4 top-12
      sm:right-10 sm:top-16
      lg:right-20 lg:top-28

      flex items-center gap-3

      rounded-2xl
      border border-white/40
      bg-white/80
      px-5 py-4

      backdrop-blur-xl
      ring-1 ring-black/5

      shadow-[0_30px_70px_rgba(0,0,0,0.22)]

      transition-all
      duration-500

      [transform:rotateX(55deg)_rotateZ(6deg)]
      hover:-translate-y-2
      hover:scale-105
      hover:shadow-[0_40px_90px_rgba(0,0,0,0.30)]
      hover:[transform:rotateX(0deg)_rotateZ(0deg)]
    "
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg">
            📄
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">Resume</p>
            <p className="text-sm text-zinc-600">Analysis</p>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div
          className="
      absolute
      bottom-20
      right-4

      sm:right-10
      sm:bottom-24

      lg:right-20
      lg:bottom-40

      rounded-2xl
      border border-white/40
      bg-white/80
      p-5

      backdrop-blur-xl
      ring-1 ring-black/5

      shadow-[0_30px_70px_rgba(0,0,0,0.22)]

      transition-all
      duration-500

      [transform:rotateX(55deg)_rotateZ(-5deg)]
      hover:-translate-y-2
      hover:scale-105
      hover:shadow-[0_40px_90px_rgba(0,0,0,0.30)]
      hover:[transform:rotateX(0deg)_rotateZ(0deg)]
    "
        >
          <p className="text-sm font-semibold text-zinc-900">
            Recommended Jobs
          </p>

          <div className="mt-4 flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg"></div>

            <div className="space-y-2">
              <div className="h-3 w-32 rounded-full bg-zinc-300" />
              <div className="h-3 w-24 rounded-full bg-zinc-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
