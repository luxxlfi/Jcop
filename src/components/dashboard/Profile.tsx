"use client";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Profile() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="">
            <h1>HOME profile</h1>
            <Button onClick={handleLogout}>logout</Button>
        </div>
    );
}
