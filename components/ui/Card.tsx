"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ children, glass = true, className = "", ...props }: CardProps) {
  const styles = glass
    ? "glass-card"
    : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/40 dark:shadow-none";

  return (
    <div
      className={`rounded-2xl p-6 ${styles} ${className}`}
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
    <div className={`mt-6 pt-4 border-t border-slate-100/80 dark:border-slate-800/60 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}
