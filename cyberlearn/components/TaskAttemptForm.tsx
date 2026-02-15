"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackCard } from "./FeedbackCard";

interface TaskAttemptFormProps {
  taskId: string;
  objective?: string;
  rubric?: string;
  onSubmitted?: () => void;
}

export function TaskAttemptForm({ taskId, onSubmitted }: TaskAttemptFormProps) {
  const [whatIDid, setWhatIDid] = useState("");
  const [howIVerified, setHowIVerified] = useState("");
  const [rollbackPlan, setRollbackPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatIDid: whatIDid.trim(),
          howIVerified: howIVerified.trim(),
          rollbackPlan: rollbackPlan.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Submission failed");
        return;
      }
      setResult({ score: data.score, feedback: data.feedback });
      onSubmitted?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-[#121A2B] border-[#1E2A44]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#E6EDF3]">Submit your attempt</h3>
          <p className="text-sm text-muted-foreground">
            Describe what you did, how you verified, and your rollback plan.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#E6EDF3]">
                What did you do?
              </label>
              <Textarea
                placeholder="Steps you took..."
                value={whatIDid}
                onChange={(e) => setWhatIDid(e.target.value)}
                required
                rows={4}
                className="bg-[#0A0F1C] border-[#1E2A44] text-[#E6EDF3] placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#E6EDF3]">
                How did you verify?
              </label>
              <Textarea
                placeholder="Proof / verification steps..."
                value={howIVerified}
                onChange={(e) => setHowIVerified(e.target.value)}
                required
                rows={4}
                className="bg-[#0A0F1C] border-[#1E2A44] text-[#E6EDF3] placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#E6EDF3]">
                Rollback plan
              </label>
              <Textarea
                placeholder="How to revert safely..."
                value={rollbackPlan}
                onChange={(e) => setRollbackPlan(e.target.value)}
                required
                rows={3}
                className="bg-[#0A0F1C] border-[#1E2A44] text-[#E6EDF3] placeholder:text-muted-foreground"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="btn-gradient"
            >
              {loading ? "Grading..." : "Submit for grading"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {result && (
        <FeedbackCard score={result.score} feedback={result.feedback} />
      )}
    </div>
  );
}
