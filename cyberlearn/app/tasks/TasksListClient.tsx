"use client";

import { useState, useMemo } from "react";
import { TaskCard } from "@/components/TaskCard";
import type { TaskRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";

type PlatformFilter = "all" | "GoogleWorkspace" | "Okta";

interface TasksListClientProps {
  initialTasks: (TaskRecord & { id: string })[];
}

export function TasksListClient({ initialTasks }: TasksListClientProps) {
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [tier, setTier] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    let list = initialTasks;
    if (platform !== "all") list = list.filter((t) => t.platform === platform);
    if (tier !== "all") list = list.filter((t) => t.tier === tier);
    return list;
  }, [initialTasks, platform, tier]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Platform:</span>
        {(["all", "GoogleWorkspace", "Okta"] as const).map((p) => (
          <Button
            key={p}
            variant={platform === p ? "default" : "outline"}
            size="sm"
            className={platform === p ? "bg-[#0FFFC1] text-[#0A0F1C]" : "border-[#1E2A44]"}
            onClick={() => setPlatform(p)}
          >
            {p === "all" ? "All" : p}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground ml-4">Tier:</span>
        {(["all", 1, 2, 3] as const).map((t) => (
          <Button
            key={String(t)}
            variant={tier === t ? "default" : "outline"}
            size="sm"
            className={tier === t ? "bg-[#0FFFC1] text-[#0A0F1C]" : "border-[#1E2A44]"}
            onClick={() => setTier(t)}
          >
            {t === "all" ? "All" : t}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-muted-foreground">No tasks match the filters.</p>
      )}
    </div>
  );
}
