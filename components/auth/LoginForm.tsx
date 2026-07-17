"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../../lib/validators";
import { useAuthStore } from "../../store/authStore";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";

export function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Invalid login credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="flex items-center justify-between">
        <Checkbox
          id="rememberMe"
          label="Remember me"
          {...register("rememberMe")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        loading={isSubmitting}
        icon={<LogIn className="h-4.5 w-4.5" />}
      >
        Sign In
      </Button>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
        {"Don't have an account? "}
        <Link
          href="/register"
          className="font-bold text-indigo-650 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
