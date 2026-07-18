import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(25, "Username cannot exceed 25 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(/^[ -~]*$/, "Only English characters, numbers and standard symbols are allowed")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Task name is required").max(100, "Task name cannot exceed 100 characters"),
  priority: z.number().min(1).max(10),
});

export type TaskInput = z.infer<typeof taskSchema>;
