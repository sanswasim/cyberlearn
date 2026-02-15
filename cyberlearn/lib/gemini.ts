import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-1.5-flash";

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenerativeAI(key);
}

function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in Gemini output");
  return JSON.parse(match[0]);
}

export async function gradeTask(params: {
  objective: string;
  rubric: string;
  studentAnswer: string;
}): Promise<{ score: number; feedback: string }> {
  const gen = getClient();
  const model = gen.getGenerativeModel({ model: MODEL });

  const prompt = `You are a coach grading an administrator's task submission.
Do NOT reveal the full correct answer or solution. Provide guidance only.

TASK OBJECTIVE:
${params.objective}

GRADING RUBRIC:
${params.rubric}

STUDENT SUBMISSION:
${params.studentAnswer}

Respond with ONLY a valid JSON object (no markdown, no code block), with exactly:
{"score": <0-10 integer>, "feedback": "<string>"}.
Do not give away the exact solution.`;

  const runOnce = async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = (text || "")
      .replace(/```json?\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = extractJSON(cleaned) as { score?: number; feedback?: string };
    const score = Math.min(10, Math.max(0, Math.round(Number(parsed.score) ?? 0)));
    const feedback =
      typeof parsed.feedback === "string" ? parsed.feedback : "No feedback provided.";
    return { score, feedback };
  };

  try {
    return await runOnce();
  } catch {
    return await runOnce(); // retry once
  }
}

export function getHint(params: {
  hintLevel: 1 | 2 | 3;
  hint1: string;
  hint2: string;
  hint3: string;
}): string {
  if (params.hintLevel === 1) return params.hint1;
  if (params.hintLevel === 2) return params.hint2;
  return params.hint3;
}
