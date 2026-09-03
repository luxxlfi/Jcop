import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CVClient from "@/components/dashboard/cv/CVClient";

export default async function CVPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("id, title, raw_text, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cvError) throw new Error(cvError.message);

  // Ambil review terakhir untuk CV ini (kalau ada)
  const { data: lastReview, error: reviewError } = cv
    ? await supabase
        .from("cv_reviews")
        .select("id, improved_text, result, created_at")
        .eq("cv_id", cv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null, error: null };

  if (reviewError) throw new Error(reviewError.message);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <CVClient
        userId={user.id}
        initialCv={cv ?? null}
        initialReview={lastReview ?? null}
      />
    </div>
  );
}