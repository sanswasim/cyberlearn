import { Timestamp } from "firebase-admin/firestore";

export type Platform = "GoogleWorkspace" | "Okta";

export type Difficulty =
  | "Very Easy"
  | "Easy"
  | "Medium"
  | "Hard"
  | "Very Hard";

export interface UserRecord {
  oktaSub: string;
  email: string;
  name: string;
  tier: number;
  xp: number;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface TaskRecord {
  id?: string;
  title: string;
  platform: Platform;
  tier: number;
  difficulty: Difficulty;
  description: string;
  objective: string;
  hint1: string;
  hint2: string;
  hint3: string;
  rubric: string;
  createdAt: Timestamp;
}

export interface AttemptRecord {
  id?: string;
  userId: string;
  taskId: string;
  whatIDid: string;
  howIVerified: string;
  rollbackPlan: string;
  combinedAnswer: string;
  score: number;
  feedback: string;
  createdAt: Timestamp;
}

export interface UserStatsRecord {
  completedTaskIds: string[];
  avgScore: number;
  updatedAt: Timestamp;
}

export interface GeminiGradeResult {
  score: number;
  feedback: string;
}
