import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CVClient from "@/components/dashboard/cv/CVClient";

export default async function CVPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cv, error } = await supabase
    .from("cvs")
    .select("id, title, raw_text, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return (
    <div className="mx-auto w-full max-w-3xl p-8">
      <CVClient userId={user.id} initialCv={cv ?? null} />
    </div>
  );
}