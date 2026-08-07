"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { Spinner } from "../ui/Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const store = useChatStore.getState();
      store.connectWS();
      store.fetchUsers();
      store.fetchRequests();
      store.fetchChannels();
      store.fetchChannelInvites();
    }
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
