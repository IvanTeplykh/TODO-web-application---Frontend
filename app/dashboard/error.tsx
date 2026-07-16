"use client";

import React, { useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <Card className="border border-rose-200/50 dark:border-rose-950/30 max-w-md w-full text-center shadow-xl !p-8 flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-55 text-rose-650 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Workspace Error
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {error.message || "Failed to load dashboard data. Check backend status."}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => reset()}
          icon={<RotateCcw className="h-4 w-4" />}
          className="mt-2"
        >
          Try Again
        </Button>
      </Card>
    </div>
  );
}
