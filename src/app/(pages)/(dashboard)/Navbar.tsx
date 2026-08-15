"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const items = [
  
  { href: "/profile", label: "Profile" },
  { href: "/jobs", label: "Jops" },
  { href: "/cv", label: "CV" },
  
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
    <header className="sticky top-0 z-50 w-full border-b border-outline/10 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
       <div className="">
        <h1><span className="text-red-600">J</span>cop</h1>
       </div>
          
        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative rounded-full px-4 py-2 font-body-md text-body-md transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-primary/10" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button onClick={handleLogout}>logout</Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-on-surface-variant hover:text-primary md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={clsx(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out md:hidden",
          open ? "max-h-64" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-outline/10 px-4 py-3">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded-lg px-3 py-2 font-body-md text-body-md transition-colors duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-primary/5 hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
