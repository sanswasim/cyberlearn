import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
  score: number;
  feedback: string;
  className?: string;
}

export function FeedbackCard({ score, feedback, className }: FeedbackCardProps) {
  const passed = score >= 7;
  return (
    <Card className={cn("bg-[#121A2B] border-[#1E2A44]", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Grade</span>
          <Badge variant={passed ? "default" : "secondary"} className={passed ? "bg-[#0FFFC1] text-[#0A0F1C]" : ""}>
            {score}/10 {passed ? "✓ Pass" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#E6EDF3] whitespace-pre-wrap">{feedback}</p>
      </CardContent>
    </Card>
  );
}
