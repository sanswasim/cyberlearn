import type { NextAuthOptions } from "next-auth";
import OktaProvider from "next-auth/providers/okta";
import { upsertUser } from "@/lib/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      issuer: process.env.OKTA_ISSUER!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "okta" || !user?.email) return true;
      const sub = profile?.sub ?? (user as { sub?: string }).sub ?? user.email;
      try {
        await upsertUser({
          oktaSub: sub,
          email: user.email,
          name: user.name ?? "",
        });
      } catch {
        // allow login even if Firestore upsert fails (e.g. env not set locally)
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "okta" && profile?.sub) {
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token.id as string) ?? (token.sub as string);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
