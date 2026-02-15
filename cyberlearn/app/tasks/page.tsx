import { requireAuth } from "@/lib/auth";
import { getTasks } from "@/lib/firestore";
import { TasksListClient } from "./TasksListClient";

export default async function TasksPage() {
  await requireAuth();
  const tasks = await getTasks();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#E6EDF3]">Tasks</h2>
        <p className="text-muted-foreground mt-1">
          Filter by platform and tier. Click Start to attempt a task.
        </p>
      </div>
      <TasksListClient initialTasks={tasks} />
    </div>
  );
}
