import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getTasks, getUserByOktaSub, getUserStats } from "@/lib/firestore";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="opacity-80">
          Continue your path to Associate Google Workspace Administrator and Okta
          Certified Professional.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recommended tasks</h2>
        <Button asChild variant="outline">
          <Link href="/tasks">View all</Link>
        </Button>
      </div>

      {recommended.length === 0 ? (
        <div className="rounded-lg border border-[#1E2A44] bg-[#121A2B] p-4 opacity-80">
          No recommended tasks. Try increasing your tier or check back later.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
