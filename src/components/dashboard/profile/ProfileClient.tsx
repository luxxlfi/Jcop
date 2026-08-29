"use client";

import { useState } from "react";
import ProfileCard from "@/components/dashboard/profile/ProfileCard";
import ProfileForm from "./ProfileForm";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
};

export default function ProfileClient({ initialProfile }: { initialProfile: Profile }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-4">
      {!editing ? (
        <ProfileCard profile={initialProfile} onEdit={() => setEditing(true)} />
      ) : (
        <ProfileForm profile={initialProfile} onCancel={() => setEditing(false)} />
      )}
    </div>
  );
}