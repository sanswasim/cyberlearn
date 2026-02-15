"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/progress", label: "Progress" },
];

function Sidebar(_props?: { userEmail?: string | null }) {
  const pathname = usePathname();
  return (
    <aside className="flex w-56 flex-col border-r border-[#1E2A44] bg-[#121A2B]">
      <div className="flex h-14 items-center border-b border-[#1E2A44] px-4">
        <Link href="/dashboard" className="font-semibold text-[#0FFFC1]">
          CyberLearn
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#1E2A44] text-[#0FFFC1]"
                : "text-[#E6EDF3] hover:bg-[#1E2A44] hover:text-[#0FFFC1]"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-[#1E2A44] p-3">
        {_props?.userEmail && (
          <p className="truncate px-2 text-xs text-muted-foreground" title={_props.userEmail}>
            {_props.userEmail}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
