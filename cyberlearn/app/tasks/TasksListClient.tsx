"use client";

import { useMemo, useState } from "react";
import type { TaskRecord } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";

type PlatformFilter = "all" | "GoogleWorkspace" | "Okta";
type TierFilter = "all" | 1 | 2 | 3 | 4 | 5;

interface TasksListClientProps {
  initialTasks: (TaskRecord & { id: string })[];
}

export function TasksListClient({ initialTasks }: TasksListClientProps) {
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [tier, setTier] = useState<TierFilter>("all");

  const filtered = useMemo(() => {
    let list = initialTasks;
    if (platform !== "all") list = list.filter((t) => t.platform === platform);
    if (tier !== "all") list = list.filter((t) => t.tier === tier);
    return list;
  }, [initialTasks, platform, tier]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm opacity-70">Platform:</div>
        {(["all", "GoogleWorkspace", "Okta"] as const).map((p) => (
          <Button
            key={p}
            variant={platform === p ? "default" : "outline"}
            onClick={() => setPlatform(p)}
          >
            {p === "all" ? "All" : p}
          </Button>
        ))}

        <div className="ml-4 text-sm opacity-70">Tier:</div>
        {(["all", 1, 2, 3, 4, 5] as const).map((t) => (
          <Button
            key={String(t)}
            variant={tier === t ? "default" : "outline"}
            onClick={() => setTier(t as TierFilter)}
          >
            {t === "all" ? "All" : `Tier ${t}`}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-[#1E2A44] bg-[#121A2B] p-4 opacity-80">
          No tasks match the filters.
        </div>
      )}
    </div>
  );
}
