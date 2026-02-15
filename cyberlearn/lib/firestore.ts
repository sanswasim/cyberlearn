import { getApps, initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { UserRecord, TaskRecord, AttemptRecord, UserStatsRecord } from "./types";
import { Timestamp } from "firebase-admin/firestore";
import { isFirestoreConfigured, missingEnv } from "./config";

const FIRESTORE_ENV_KEYS = ["GOOGLE_CLOUD_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];

function getFirestoreAdmin(): Firestore {
  if (!isFirestoreConfigured()) {
    const missing = missingEnv(FIRESTORE_ENV_KEYS);
    throw new Error(`Firestore is not configured. Missing env vars: ${missing.join(", ")}`);
  }

  if (getApps().length === 0) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID!;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY ?? "";
    const privateKey = rawKey.replace(/\\n/g, "\n");

    const credentials: ServiceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };

    initializeApp({ credential: cert(credentials) });
  }
  return getFirestore();
}

const USERS = "users";
const TASKS = "tasks";
const ATTEMPTS = "attempts";
const USER_STATS = "userStats";

export function getUserByOktaSub(oktaSub: string): Promise<UserRecord | null> {
  const db = getFirestoreAdmin();
  return db
    .collection(USERS)
    .doc(oktaSub)
    .get()
    .then((snap) => (snap.exists ? (snap.data() as UserRecord) : null));
}

export function upsertUser(data: {
  oktaSub: string;
  email: string;
  name: string;
}): Promise<void> {
  const db = getFirestoreAdmin();
  const ref = db.collection(USERS).doc(data.oktaSub);
  const now = Timestamp.now();
  return ref.get().then((snap) => {
    if (snap.exists) {
      return ref.update({
        email: data.email,
        name: data.name,
        lastLoginAt: now,
      }).then(() => undefined);
    }
    return ref.set({
      oktaSub: data.oktaSub,
      email: data.email,
      name: data.name,
      tier: 1,
      xp: 0,
      createdAt: now,
      lastLoginAt: now,
    }).then(() => undefined);
  });
}

export function getTasks(filters?: {
  platform?: "GoogleWorkspace" | "Okta";
  tier?: number;
}): Promise<(TaskRecord & { id: string })[]> {
  const db = getFirestoreAdmin();
  let q = db.collection(TASKS).orderBy("createdAt", "desc");
  if (filters?.platform) {
    q = q.where("platform", "==", filters.platform) as ReturnType<typeof q.where>;
  }
  if (filters?.tier != null) {
    q = q.where("tier", "==", filters.tier) as ReturnType<typeof q.where>;
  }
  return q.get().then((snap) =>
    snap.docs.map((d) => ({ ...(d.data() as TaskRecord), id: d.id }))
  );
}

export function getTaskById(taskId: string): Promise<(TaskRecord & { id: string }) | null> {
  const db = getFirestoreAdmin();
  return db
    .collection(TASKS)
    .doc(taskId)
    .get()
    .then((snap) =>
      snap.exists ? { ...(snap.data() as TaskRecord), id: snap.id } : null
    );
}

export function createAttempt(data: Omit<AttemptRecord, "id" | "createdAt">): Promise<string> {
  const db = getFirestoreAdmin();
  return db
    .collection(ATTEMPTS)
    .add({
      ...data,
      createdAt: Timestamp.now(),
    })
    .then((ref) => ref.id);
}

export function getAttemptsByUser(userId: string): Promise<(AttemptRecord & { id: string })[]> {
  const db = getFirestoreAdmin();
  return db
    .collection(ATTEMPTS)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ ...(d.data() as AttemptRecord), id: d.id }))
    );
}

export function getAttemptsByUserAndTask(
  userId: string,
  taskId: string
): Promise<(AttemptRecord & { id: string })[]> {
  const db = getFirestoreAdmin();
  return db
    .collection(ATTEMPTS)
    .where("userId", "==", userId)
    .where("taskId", "==", taskId)
    .orderBy("createdAt", "desc")
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ ...(d.data() as AttemptRecord), id: d.id }))
    );
}

const COMPLETED_SCORE_THRESHOLD = 7;

export function getUserStats(userId: string): Promise<UserStatsRecord | null> {
  const db = getFirestoreAdmin();
  return db
    .collection(USER_STATS)
    .doc(userId)
    .get()
    .then((snap) => (snap.exists ? (snap.data() as UserStatsRecord) : null));
}

/** Recompute and persist user stats from all attempts. Call after creating an attempt. */
export async function refreshUserStats(userId: string): Promise<void> {
  const attempts = await getAttemptsByUser(userId);
  const byTask = new Map<string, number>();
  let totalScore = 0;
  let count = 0;
  for (const a of attempts) {
    const best = byTask.get(a.taskId);
    if (best === undefined || a.score > best) byTask.set(a.taskId, a.score);
    totalScore += a.score;
    count += 1;
  }
  const completedTaskIds = Array.from(byTask.entries())
    .filter(([, s]) => s >= COMPLETED_SCORE_THRESHOLD)
    .map(([id]) => id);
  const avgScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
  const db = getFirestoreAdmin();
  await db.collection(USER_STATS).doc(userId).set({
    completedTaskIds,
    avgScore,
    updatedAt: Timestamp.now(),
  });
}
