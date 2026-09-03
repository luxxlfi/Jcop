import { Button } from "@/components/ui/button";
import type { Profile } from "./ProfileClient";
import { User, MapPin, Edit3, Link2, Code, Globe, Phone, Mail } from "lucide-react";

export default function ProfileCard({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  const name = profile.full_name?.trim() || "Nama Belum Diisi";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-2xl font-black text-white shadow-lg shadow-red-500/25">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span>{initials || "U"}</span>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{name}</h1>
            {profile.location && (
              <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-red-500" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={onEdit}
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl px-5 shadow-md shadow-red-600/20"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profil
        </Button>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="space-y-2">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Tentang Saya / Bio</h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Social & Contact Links */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Kontak & Tautan Profesional</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.phone && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">{profile.phone}</span>
            </div>
          )}

          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/30 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100/60 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Link2 className="h-4 w-4 shrink-0" />
              <span className="truncate">LinkedIn</span>
            </a>
          )}

          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <Code className="h-4 w-4 shrink-0" />
              <span className="truncate">GitHub</span>
            </a>
          )}

          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/30 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">Portfolio / Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}