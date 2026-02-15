import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./StatCard";
import { cn } from "@/lib/utils";

interface ProgressOverviewProps {
  totalAttempts: number;
  completedCount: number;
  totalTasks: number;
  avgScore: number;
  byPlatform: { platform: string; count: number; avgScore: number }[];
}

export function ProgressOverview({
  totalAttempts,
  completedCount,
  totalTasks,
  avgScore,
  byPlatform,
}: ProgressOverviewProps) {
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tasks attempted" value={totalAttempts} subtitle="Total submissions" />
        <StatCard
          title="Tasks completed"
          value={`${completedCount} / ${totalTasks}`}
          subtitle="Score ≥ 7"
        />
        <StatCard title="Average score" value={avgScore.toFixed(1)} subtitle="Across all attempts" />
      </div>
      <Card className="bg-[#121A2B] border-[#1E2A44]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#E6EDF3]">Progress</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalTasks} tasks completed (score ≥ 7)
          </p>
        </CardHeader>
        <CardContent>
          <Progress value={progressPct} className="h-3" />
        </CardContent>
      </Card>
      <Card className="bg-[#121A2B] border-[#1E2A44]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#E6EDF3]">By platform</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {byPlatform.map(({ platform, count, avgScore: pAvg }) => (
              <li
                key={platform}
                className={cn(
                  "flex items-center justify-between rounded-md border border-[#1E2A44] px-3 py-2 text-sm"
                )}
              >
                <span className="font-medium text-[#E6EDF3]">{platform}</span>
                <span className="text-muted-foreground">
                  {count} completed · avg {pAvg.toFixed(1)}
                </span>
              </li>
            ))}
            {byPlatform.length === 0 && (
              <p className="text-sm text-muted-foreground">No completed tasks yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
