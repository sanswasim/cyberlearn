"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HintBoxProps {
  hint1: string;
  hint2: string;
  hint3: string;
}

export function HintBox({ hint1, hint2, hint3 }: HintBoxProps) {
  const [level, setLevel] = useState(0);
  const hints = [hint1, hint2, hint3];
  const visible = hints.slice(0, level);

  return (
    <Card className="bg-[#121A2B] border-[#1E2A44]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Progressive hints</span>
          {level < 3 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#1E2A44] text-[#0FFFC1] hover:bg-[#1E2A44]"
              onClick={() => setLevel((n) => Math.min(3, n + 1))}
            >
              {level === 0 ? "Show hint 1" : level === 1 ? "Show hint 2" : "Show hint 3"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">Click the button above to reveal hints one at a time.</p>
        )}
        {visible.map((hint, i) => (
          <div
            key={i}
            className={cn(
              "rounded-md border border-[#1E2A44] bg-[#0A0F1C]/50 px-3 py-2 text-sm",
              "text-[#E6EDF3]"
            )}
          >
            <span className="font-medium text-[#0FFFC1]">Hint {i + 1}:</span> {hint}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
