"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLogin = pathname === "/login";
  if (isLogin) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen bg-[#0A0F1C] text-[#E6EDF3]">
      <Sidebar userEmail={session?.user?.email ?? null} />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
