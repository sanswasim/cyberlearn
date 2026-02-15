"use client";

import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center border-b border-[#1E2A44] p-4">
      <div className="font-semibold">CyberLearn</div>

      <div className="flex items-center gap-4">
        <span className="text-sm opacity-70">
          {session?.user?.email}
        </span>

        <button
          onClick={() => signOut()}
          className="px-3 py-1 rounded bg-gradient-to-r from-[#0B3C5D] to-[#00C2FF]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
