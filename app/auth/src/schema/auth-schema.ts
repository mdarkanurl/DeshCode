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