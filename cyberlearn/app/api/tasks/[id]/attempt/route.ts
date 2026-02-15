import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getTaskById } from "@/lib/firestore";
import { createAttempt, refreshUserStats } from "@/lib/firestore";
import { gradeTask } from "@/lib/gemini";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id ?? (session.user as { sub?: string }).sub;
  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const { id: taskId } = await params;
  const task = await getTaskById(taskId);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  let body: { whatIDid?: string; howIVerified?: string; rollbackPlan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { whatIDid = "", howIVerified = "", rollbackPlan = "" } = body;
  if (!whatIDid.trim() || !howIVerified.trim() || !rollbackPlan.trim()) {
    return NextResponse.json(
      { error: "whatIDid, howIVerified, and rollbackPlan are required" },
      { status: 400 }
    );
  }

  const combinedAnswer = [
    "What I did:",
    whatIDid.trim(),
    "How I verified:",
    howIVerified.trim(),
    "Rollback plan:",
    rollbackPlan.trim(),
  ].join("\n");

  let score: number;
  let feedback: string;
  try {
    const result = await gradeTask({
      objective: task.objective,
      rubric: task.rubric,
      studentAnswer: combinedAnswer,
    });
    score = result.score;
    feedback = result.feedback;
  } catch (e) {
    console.error("Gemini grade error:", e);
    return NextResponse.json(
      { error: "Grading failed. Check GEMINI_API_KEY and try again." },
      { status: 500 }
    );
  }

  await createAttempt({
    userId,
    taskId,
    whatIDid: whatIDid.trim(),
    howIVerified: howIVerified.trim(),
    rollbackPlan: rollbackPlan.trim(),
    combinedAnswer,
    score,
    feedback,
  });
  await refreshUserStats(userId);

  return NextResponse.json({ score, feedback });
}
