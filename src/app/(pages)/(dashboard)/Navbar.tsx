"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, FileText, User, LogOut } from "lucide-react";
import clsx from "clsx";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/cv", label: "Revisi CV", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Brand Logo - Original Red Jcop style */}
        <Link href="/cv" className="flex items-center gap-1.5">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900">
            <span className="text-red-600">J</span>cop
          </span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            CV AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "text-zinc-600 hover:text-red-600 hover:bg-slate-50"
                )}
              >
                <Icon className={clsx("h-4 w-4", isActive ? "text-red-600" : "text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700 rounded-xl px-5 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden border-t border-gray-100 bg-white",
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-red-600"
                )}
              >
                <Icon className={clsx("h-4 w-4", isActive ? "text-red-600" : "text-zinc-400")} />
                {item.label}
              </Link>
            );
          })}

          <Button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="mt-2 w-full bg-red-600 text-white hover:bg-red-700 rounded-xl"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}


