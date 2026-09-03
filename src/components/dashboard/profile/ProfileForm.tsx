"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "./ProfileClient";
import { User, MapPin, Link2, Code, Globe, Save, X, AlertCircle } from "lucide-react";

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
    onCancel();
  };

  return (
    <form
      onSubmit={onSave}
      className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profil Saya</h2>
          <p className="text-xs text-slate-500">Perbarui informasi diri dan tautan profesional Anda.</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4 mr-1" />
          Batal
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio Ringkas</Label>
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Contoh: Frontend Developer dengan pengalaman React & Next.js..."
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Lokasi</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Jakarta, Indonesia"
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">LinkedIn URL</Label>
          <Input
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GitHub URL</Label>
          <Input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/username"
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Portfolio / Website URL</Label>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://mywebsite.com"
            className="rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          disabled={loading}
          type="submit"
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl px-6 shadow-md shadow-red-600/20"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
          Batal
        </Button>
      </div>
    </form>
  );
}