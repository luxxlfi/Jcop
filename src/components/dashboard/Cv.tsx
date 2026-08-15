"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function cv() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <div className="">
      <h1>CV</h1>
    </div>
  );
}
