import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-1.5-flash";

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
  if (!process.env.GEMINI_API_KEY) {
    return {
      score: 5,
      feedback:
        "Gemini is not configured yet. Submission saved successfully. Add verification and rollback steps for a higher score.",
    };
  }

  const gen = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gen.getGenerativeModel({ model: MODEL });

  const prompt = `Grade this admin task submission and return ONLY JSON:
{"score": number, "feedback": string}

Objective:
${params.objective}

Rubric:
${params.rubric}

Submission:
${params.studentAnswer}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text() || "";
  const cleaned = text.replace(/```json?/g, "").replace(/```/g, "").trim();

  const parsed = extractJSON(cleaned);
  return {
    score: Math.max(0, Math.min(10, Number(parsed.score) || 0)),
    feedback: parsed.feedback || "No feedback",
  };
}

export function getHint(params: {
  hintLevel: 1 | 2 | 3;
  hint1: string;
  hint2: string;
  hint3: string;
}) {
  if (params.hintLevel === 1) return params.hint1;
  if (params.hintLevel === 2) return params.hint2;
  return params.hint3;
}
