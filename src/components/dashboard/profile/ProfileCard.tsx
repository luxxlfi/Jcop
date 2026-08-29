import { Button } from "@/components/ui/button";
import type { Profile } from "./ProfileClient";

export default function ProfileCard({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  const name = profile.full_name?.trim() || "Nama belum diisi";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-full bg-slate-200" />
          <div className="space-y-1">
            <h1 className="text-xl font-bold">{name}</h1>
            {profile.location && <p className="text-sm text-slate-600">{profile.location}</p>}
            {profile.bio && <p className="pt-2 text-sm text-slate-700">{profile.bio}</p>}
          </div>
        </div>

        <Button onClick={onEdit} className="bg-red-600 text-white hover:bg-red-700">
          Edit Profile
        </Button>
      </div>

      <div className="mt-6 grid gap-2 text-sm text-slate-700">
        {profile.linkedin_url && (
          <a className="underline" href={profile.linkedin_url} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a className="underline" href={profile.github_url} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {profile.website_url && (
          <a className="underline" href={profile.website_url} target="_blank" rel="noreferrer">
            Website
          </a>
        )}
      </div>
    </div>
  );
}