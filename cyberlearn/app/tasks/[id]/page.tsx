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
  params: { id: string };
}) {
  await requireAuth();
  const task = await getTaskById(params.id);
  if (!task) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/tasks">← Tasks</Link>
        </Button>
        <Badge variant="secondary">{task.platform}</Badge>
        <Badge variant="outline">Tier {task.tier}</Badge>
        <Badge variant="outline">{task.difficulty}</Badge>
      </div>

      <Card className="border-[#1E2A44] bg-[#121A2B]">
        <CardHeader>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Objective</h3>
            <p className="opacity-90">{task.objective}</p>
          </div>
          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="opacity-90">{task.description}</p>
          </div>
        </CardContent>
      </Card>

      <HintBox hint1={task.hint1} hint2={task.hint2} hint3={task.hint3} />

      <TaskAttemptForm
        taskId={params.id}
        objective={task.objective}
        rubric={task.rubric}
      />
    </div>
  );
}
