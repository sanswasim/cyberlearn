import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaskRecord } from "@/lib/types";

interface TaskCardProps {
  task: TaskRecord & { id: string };
  showStart?: boolean;
}

const platformVariant = (platform: string) =>
  platform === "Okta" ? "secondary" : "default";

export function TaskCard({ task, showStart = true }: TaskCardProps) {
  return (
    <Card className="bg-[#121A2B] border-[#1E2A44] transition-colors hover:border-[#0FFFC1]/40">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={platformVariant(task.platform)}>{task.platform}</Badge>
          <Badge variant="outline">Tier {task.tier}</Badge>
          <Badge variant="secondary">{task.difficulty}</Badge>
        </div>
        <h3 className="text-lg font-semibold text-[#E6EDF3] mt-2">{task.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{task.objective}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
      </CardContent>
      {showStart && (
        <CardFooter className="pt-2">
          <Button asChild className="btn-gradient">
            <Link href={`/tasks/${task.id}`}>Start</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
