"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "../../lib/validators";
import { useAuthStore } from "../../store/authStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export function RegisterForm() {
  const registerUser = useAuthStore((state) => state.register);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password") || "";

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data);
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="username"
        label="Username"
        type="text"
        placeholder="johndoe"
        icon={<User className="h-4.5 w-4.5" />}
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="h-4.5 w-4.5" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4.5 w-4.5" />}
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4.5 w-4.5" />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Password requirements checklist */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Password must contain:
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium">
          <div className={`flex items-center gap-1.5 ${passwordVal.length >= 8 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${passwordVal.length >= 8 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            Min. 8 characters
          </div>
          <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(passwordVal) ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(passwordVal) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            One uppercase letter
          </div>
          <div className={`flex items-center gap-1.5 ${/[0-9]/.test(passwordVal) ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(passwordVal) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            One number
          </div>
          <div className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(passwordVal) ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(passwordVal) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
            One special char
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        loading={isSubmitting}
        icon={<UserPlus className="h-4.5 w-4.5" />}
      >
        Sign Up
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-slate-805"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2.5 text-[10px] tracking-wider font-semibold text-slate-400 dark:bg-slate-900">
            or continue with
          </span>
        </div>
      </div>

      {/* Social options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          GitHub
        </button>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-605 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
