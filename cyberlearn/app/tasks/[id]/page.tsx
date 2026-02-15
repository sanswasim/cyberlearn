import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getTaskById } from "@/lib/firestore";
import { HintBox } from "@/components/HintBox";
import { TaskAttemptForm } from "@/components/TaskAttemptForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;
  const task = await getTaskById(id);
  if (!task) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
          <Link href="/tasks">← Tasks</Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{task.platform}</Badge>
        <Badge variant="outline">Tier {task.tier}</Badge>
        <Badge variant="secondary">{task.difficulty}</Badge>
      </div>
      <h1 className="text-2xl font-bold text-[#E6EDF3]">{task.title}</h1>
      <Card className="bg-[#121A2B] border-[#1E2A44]">
        <CardHeader>
          <h3 className="text-sm font-medium text-muted-foreground">Objective</h3>
          <p className="text-[#E6EDF3]">{task.objective}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
          <p className="text-[#E6EDF3] whitespace-pre-wrap">{task.description}</p>
        </CardContent>
      </Card>
      <HintBox hint1={task.hint1} hint2={task.hint2} hint3={task.hint3} />
      <TaskAttemptForm taskId={task.id} />
    </div>
  );
}
