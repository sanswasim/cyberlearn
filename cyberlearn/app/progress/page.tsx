import { requireAuth } from "@/lib/auth";
import { getAttemptsByUser } from "@/lib/firestore";
import { getTasks } from "@/lib/firestore";
import { ProgressOverview } from "@/components/ProgressOverview";

const COMPLETED_SCORE = 7;

export default async function ProgressPage() {
  const session = await requireAuth();
  const userId = (session.user as { id?: string }).id ?? "";
  const [attempts, allTasks] = await Promise.all([
    getAttemptsByUser(userId),
    getTasks(),
  ]);

  const totalTasks = allTasks.length;
  const byTaskBest = new Map<string, number>();
  const byTaskScores = new Map<string, number[]>();
  for (const a of attempts) {
    const best = byTaskBest.get(a.taskId);
    if (best === undefined || a.score > best) byTaskBest.set(a.taskId, a.score);
    const arr = byTaskScores.get(a.taskId) ?? [];
    arr.push(a.score);
    byTaskScores.set(a.taskId, arr);
  }
  const completedCount = Array.from(byTaskBest.values()).filter((s) => s >= COMPLETED_SCORE).length;
  const totalScoreSum = attempts.reduce((sum, a) => sum + a.score, 0);
  const avgScore = attempts.length > 0 ? Math.round((totalScoreSum / attempts.length) * 10) / 10 : 0;

  const taskById = new Map(allTasks.map((t) => [t.id, t]));
  const byPlatform = new Map<string, { count: number; sum: number; n: number }>();
  for (const [taskId, score] of Array.from(byTaskBest.entries())) {
    if (score < COMPLETED_SCORE) continue;
    const task = taskById.get(taskId);
    if (!task) continue;
    const key = task.platform;
    const cur = byPlatform.get(key) ?? { count: 0, sum: 0, n: 0 };
    cur.count += 1;
    cur.sum += score;
    cur.n += 1;
    byPlatform.set(key, cur);
  }
  const byPlatformList = Array.from(byPlatform.entries()).map(([platform, v]) => ({
    platform,
    count: v.count,
    avgScore: v.n > 0 ? Math.round((v.sum / v.n) * 10) / 10 : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Progress</h2>
        <p className="text-muted-foreground mt-1">
          Your completed tasks and performance by platform.
        </p>
      </div>
      <ProgressOverview
        totalAttempts={attempts.length}
        completedCount={completedCount}
        totalTasks={totalTasks}
        avgScore={avgScore}
        byPlatform={byPlatformList}
      />
    </div>
  );
}
