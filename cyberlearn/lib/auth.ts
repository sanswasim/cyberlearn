import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  const sub = (session?.user as { id?: string })?.id ?? null;
  return sub;
}
