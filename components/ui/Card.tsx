"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ children, glass = true, className = "", ...props }: CardProps) {
  const styles = glass
    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-100/50 dark:shadow-none"
    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md";

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${styles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
