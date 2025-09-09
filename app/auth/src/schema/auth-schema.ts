import { z } from "zod";

export const signUp = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const verifyTheEmail = z.object({
  userId: z.string(),
  code: z.number()
});

export const login = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const forgetPassword = z.object({
  email: z.string().email("Invalid email address")
});

export const setForgetPassword = z.object({
  userId: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  code: z.number()
});

export const changesPassword = z.object({
  userId: z.string(),
  currentPassword: z.string().min(8, "Password must be at least 8 characters long"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long")
});
