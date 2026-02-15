import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getUserByOktaSub } from "@/lib/firestore";
import { getTasks } from "@/lib/firestore";
import { getUserStats } from "@/lib/firestore";
import { StatCard } from "@/components/StatCard";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = (session.user as { id?: string }).id ?? "";
  const [user, stats, allTasks] = await Promise.all([
    getUserByOktaSub(userId),
    getUserStats(userId),
    getTasks(),
  ]);

  const tier = user?.tier ?? 1;
  const completedIds = new Set(stats?.completedTaskIds ?? []);
  const recommended = allTasks
    .filter((t) => t.tier <= tier && !completedIds.has(t.id))
    .slice(0, 3);
  const totalTasks = allTasks.length;
  const completedCount = completedIds.size;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const avgScore = stats?.avgScore ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h2>
        <p className="text-muted-foreground mt-1">
          Continue your path to Associate Google Workspace Administrator and Okta Certified Professional.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Current tier" value={tier} />
        <StatCard title="Progress" value={`${progressPct}%`} subtitle={`${completedCount} / ${totalTasks} tasks`} />
        <StatCard title="Average score" value={avgScore.toFixed(1)} />
      </div>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#E6EDF3]">Recommended tasks</h3>
          <Button asChild variant="outline" size="sm" className="border-[#1E2A44]">
            <Link href="/tasks">View all</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommended.length === 0 ? (
            <p className="text-muted-foreground col-span-full">No recommended tasks. Try increasing your tier or check back later.</p>
          ) : (
            recommended.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
