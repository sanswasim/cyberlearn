import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiGradeResult } from "./types";

const MODEL = "gemini-1.5-flash";

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenerativeAI(key);
}

export async function gradeTask(params: {
  objective: string;
  rubric: string;
  studentAnswer: string;
}): Promise<GeminiGradeResult> {
  const gen = getClient();
  const model = gen.getGenerativeModel({ model: MODEL });

  const prompt = `You are a coach grading an administrator's task submission. Do NOT reveal the full correct answer or solution. Provide guidance only.

TASK OBJECTIVE:
${params.objective}

GRADING RUBRIC:
${params.rubric}

STUDENT SUBMISSION:
${params.studentAnswer}

Respond with ONLY a valid JSON object (no markdown, no code block), with exactly two keys:
- "score": number from 0 to 10 (integer)
- "feedback": string with coaching feedback. Mention what is missing or could be improved (e.g. verification steps, rollback plan, least privilege). Do not give away the exact solution.`;

  function extractJSON(text: string): { score?: number; feedback?: string } {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]) as { score?: number; feedback?: string };
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new Error("Empty Gemini response");

  let parsed: { score?: number; feedback?: string };
  try {
    parsed = extractJSON(text);
  } catch {
    const cleaned = text.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
    try {
      parsed = JSON.parse(cleaned) as { score?: number; feedback?: string };
    } catch {
      const retry = await model.generateContent(prompt);
      const retryText = retry.response.text();
      if (!retryText) throw new Error("Empty Gemini retry response");
      parsed = extractJSON(retryText);
    }
  }
  const score = Math.min(10, Math.max(0, Math.round(Number(parsed.score) ?? 0)));
  const feedback = typeof parsed.feedback === "string" ? parsed.feedback : "No feedback provided.";
  return { score, feedback };
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
