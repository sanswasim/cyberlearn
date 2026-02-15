import { Suspense } from "react";
import { isOktaConfigured, missingEnv } from "@/lib/config";
import { LoginContent } from "./LoginContent";

const OKTA_ENV_KEYS = [
  "OKTA_ISSUER",
  "OKTA_CLIENT_ID",
  "OKTA_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

export default function LoginPage() {
  const oktaConfigured = isOktaConfigured();
  const missingKeys = oktaConfigured ? [] : missingEnv(OKTA_ENV_KEYS);

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <LoginContent oktaConfigured={oktaConfigured} missingKeys={missingKeys} />
    </Suspense>
  );
}
