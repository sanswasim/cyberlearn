import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { isOktaConfigured, isFirestoreConfigured, isGeminiConfigured } from "@/lib/config";
import { getTasks, getUserByOktaSub, getUserStats } from "@/lib/firestore";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = (session.user as { id?: string }).id ?? "";

  const firestoreConfigured = isFirestoreConfigured();
  let user = null;
  let stats = null;
  let allTasks: Awaited<ReturnType<typeof getTasks>> = [];
  if (firestoreConfigured) {
    try {
      [user, stats, allTasks] = await Promise.all([
        getUserByOktaSub(userId),
        getUserStats(userId),
        getTasks(),
      ]);
    } catch {
      allTasks = [];
    }
  }

  const tier = user?.tier ?? 1;
  const completedIds = new Set(stats?.completedTaskIds ?? []);

  const recommended = allTasks
    .filter((t) => t.tier <= tier && !completedIds.has(t.id))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Card className="bg-[#121A2B] border-[#1E2A44]">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-medium text-[#E6EDF3]">System status</h2>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Okta:</span>
          <Badge variant={isOktaConfigured() ? "default" : "secondary"}>
            {isOktaConfigured() ? "Configured" : "Missing"}
          </Badge>
          <span className="text-sm text-muted-foreground ml-2">Firestore:</span>
          <Badge variant={firestoreConfigured ? "default" : "secondary"}>
            {firestoreConfigured ? "Configured" : "Missing"}
          </Badge>
          <span className="text-sm text-muted-foreground ml-2">Gemini:</span>
          <Badge variant={isGeminiConfigured() ? "default" : "secondary"}>
            {isGeminiConfigured() ? "Configured" : "Missing"}
          </Badge>
        </CardContent>
      </Card>

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

      {!firestoreConfigured ? (
        <div className="rounded-lg border border-[#1E2A44] bg-[#121A2B] p-4 opacity-80">
          Firestore missing. Configure GOOGLE_CLOUD_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to load recommended tasks.
        </div>
      ) : recommended.length === 0 ? (
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
