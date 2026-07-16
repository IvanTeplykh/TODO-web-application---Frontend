"use client";

import React from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import { User, Mail, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 bg-slate-50/50 dark:bg-slate-950/20 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Account Settings
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                View your credentials and manage your account session.
              </p>
            </div>

            <Card className="border border-slate-200/50 dark:border-slate-800/80 shadow-md max-w-2xl">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-750 dark:bg-indigo-950 dark:text-indigo-300">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      Security Profile
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Standard user privileges active
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/55 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Username
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {user?.username || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/55 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-505 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="flex items-center justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  icon={<LogOut className="h-4.5 w-4.5" />}
                >
                  Log Out
                </Button>
              </div>
            </Card>
          </main>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
