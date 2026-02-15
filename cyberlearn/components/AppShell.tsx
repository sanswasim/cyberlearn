"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#0A0F1C] text-[#E6EDF3]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
