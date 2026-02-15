"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginContent({
  oktaConfigured,
  missingKeys,
}: {
  oktaConfigured: boolean;
  missingKeys: string[];
}) {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C] px-4">
      <Card className="w-full max-w-md bg-[#121A2B] border-[#1E2A44]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#E6EDF3]">CyberLearn</CardTitle>
          <CardDescription>
            Sign in to access your admin training tasks and progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!oktaConfigured ? (
            <>
              <p className="text-muted-foreground text-center text-sm">
                Okta sign-in is not configured yet. Set the following environment variables to enable login:
              </p>
              <ul className="list-inside list-disc text-left text-sm text-muted-foreground">
                {missingKeys.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </>
          ) : (
            <Button
              size="lg"
              className="btn-gradient w-full"
              onClick={() => signIn("okta", { callbackUrl })}
            >
              Sign in with Okta
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
