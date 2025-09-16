import { z } from "zod";
import { UserRole } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mdarkanurl@gmail.com';
const userRoleEnum = z.enum([...(Object.values(UserRole) as [string, ...string[]])]);

export const signUp = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: userRoleEnum.optional(),
}).superRefine((data, ctx) => {
  if (data.role === UserRole.ADMIN) {
    if (data.email !== ADMIN_EMAIL) {
      ctx.addIssue({
        path: ["email"],
        message: "Admin accounts must use ADMIN_EMAIL",
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

export const resendCode = z.object({
  email: z.string().email("Invalid email address"),
})

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
