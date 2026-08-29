"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "./ProfileClient";

export default function ProfileForm({
  profile,
  onCancel,
}: {
  profile: Profile;
  onCancel: () => void;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [linkedin, setLinkedin] = useState(profile.linkedin_url ?? "");
  const [github, setGithub] = useState(profile.github_url ?? "");
  const [website, setWebsite] = useState(profile.website_url ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio,
        location,
        linkedin_url: linkedin,
        github_url: github,
        website_url: website,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    onCancel(); // balik ke card view
  };

  return (
    <form onSubmit={onSave} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Edit Profile</h2>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-2">
        <Label>Nama</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Input value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Lokasi</Label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>LinkedIn URL</Label>
        <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>GitHub URL</Label>
        <Input value={github} onChange={(e) => setGithub(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Website URL</Label>
        <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Button disabled={loading} type="submit" className="bg-red-600 text-white hover:bg-red-700">
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}