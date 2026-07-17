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

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
