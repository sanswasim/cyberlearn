"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between border-b border-[#1E2A44] px-6 py-4">
      <div className="font-semibold">CyberLearn</div>
      <div className="flex items-center gap-3">
        <div className="text-sm opacity-70">{session?.user?.email}</div>
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-gradient-to-r from-[#0B3C5D] to-[#00C2FF]"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
