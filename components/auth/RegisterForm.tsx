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
import { authService } from "../../services/auth";
import { tasksService } from "../../services/tasks";

export function RegisterForm() {
  const registerUser = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();

  const [redirectAllowed, setRedirectAllowed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const hasPendingTask = !!localStorage.getItem("pending_task");
      if (!hasPendingTask) {
        setRedirectAllowed(true);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!loading && isAuthenticated && redirectAllowed) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router, redirectAllowed]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedValues = watch(["username", "email", "password", "confirmPassword"]);
  const usernameVal = watchedValues[0] || "";
  const emailVal = watchedValues[1] || "";
  const passwordVal = watchedValues[2] || "";
  const confirmPasswordVal = watchedValues[3] || "";

  const getReqColor = (isMet: boolean) => {
    if (!passwordVal) {
      return {
        text: "text-slate-400 dark:text-slate-500",
        dot: "bg-slate-300 dark:bg-slate-700",
      };
    }
    return isMet
      ? { text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" }
      : { text: "text-rose-500/90 dark:text-rose-400/90", dot: "bg-rose-500" };
  };

  const reqLen = getReqColor(passwordVal.length >= 8);
  const reqUpper = getReqColor(/[A-Z]/.test(passwordVal));
  const reqNumber = getReqColor(/[0-9]/.test(passwordVal));
  const reqSpecial = getReqColor(/[^A-Za-z0-9]/.test(passwordVal));

  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false);
  const [emailExistsError, setEmailExistsError] = React.useState("");

  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  const isEmailVerified = emailVal && isEmailFormatValid && !errors.email && !isCheckingEmail && !emailExistsError;

  React.useEffect(() => {
    if (!emailVal || errors.email) {
      setEmailExistsError("");
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!isEmailValid) {
      setEmailExistsError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      setEmailExistsError("");
      try {
        const res = await authService.checkEmail(emailVal);
        if (res.exists) {
          setEmailExistsError("A user with this email already exists");
        }
      } catch (err) {
        console.error("Failed to check email", err);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [emailVal, errors.email]);

  const onSubmit = async (data: RegisterInput) => {
    if (isCheckingEmail || emailExistsError) {
      return;
    }
    try {
      await registerUser(data);
      toast.success("Account created successfully! Logging in...");
      await login({
        email: data.email,
        password: data.password,
        rememberMe: false,
      });

      // Automatically create the pending task from localStorage
      const pendingTaskStr = localStorage.getItem("pending_task");
      if (pendingTaskStr) {
        try {
          const pendingTask = JSON.parse(pendingTaskStr);
          await tasksService.createTask(
            pendingTask.title,
            pendingTask.priority,
            pendingTask.description,
            pendingTask.dueDate
          );
          localStorage.removeItem("pending_task");
          toast.success("Your demo task has been saved to your workspace!");
        } catch (taskErr) {
          console.error("Failed to save pending task on registration:", taskErr);
        }
      }
      setRedirectAllowed(true);
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
        placeholder="Enter your name"
        icon={<User className="h-4.5 w-4.5" />}
        error={(usernameVal || isSubmitted) ? errors.username?.message : undefined}
        maxLength={25}
        {...register("username")}
      />

      <Input
        id="email"
        label={
          <span className="flex items-center gap-0.5">
            Email Address
            {isEmailVerified && <span className="text-emerald-500 font-black text-sm ml-0.5 leading-none animate-in fade-in zoom-in duration-200">*</span>}
          </span>
        }
        type="email"
        placeholder="you@mail.com"
        icon={<Mail className="h-4.5 w-4.5" />}
        error={emailExistsError || ((emailVal || isSubmitted) ? errors.email?.message : undefined)}
        {...register("email")}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4.5 w-4.5" />}
        error={(passwordVal || isSubmitted) ? errors.password?.message : undefined}
        {...register("password")}
      />

      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4.5 w-4.5" />}
        error={(confirmPasswordVal || isSubmitted) ? errors.confirmPassword?.message : undefined}
        {...register("confirmPassword")}
      />

      {/* Password requirements checklist */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Password must contain:
        </span>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium">
          <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqLen.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqLen.dot}`} />
            Min. 8 characters
          </div>
          <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqUpper.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqUpper.dot}`} />
            One uppercase letter
          </div>
          <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqNumber.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqNumber.dot}`} />
            One number
          </div>
          <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqSpecial.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqSpecial.dot}`} />
            One special char
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        loading={isSubmitting}
        disabled={isCheckingEmail}
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
