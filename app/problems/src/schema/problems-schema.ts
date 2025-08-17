import { z } from "zod";
import { ProblemsTypes } from "../generated/prisma";

const problemsTypesEnum = z.enum([...(Object.values(ProblemsTypes) as [string, ...string[]])]);

export const createProblemsSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  functionName: z.string(),
  language: z.array(z.string().toLowerCase()).min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  testCases: z.array(z.object({
    input: z.array(z.any()),
    expected: z.any()
  })),
  problemsTypes: problemsTypesEnum,
  tags: z.array(z.string()).optional()
});

export const getProblemsSchema = z.object({
    id: z.string()
});

export const updateProblemsSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    functionName: z.string().optional(),
    language: z.array(z.string().toLowerCase()).optional(),
    testCases: z.array(z.object({
        input: z.string().min(1),
        expected: z.string().min(1)
    })).optional(),
    tags: z.array(z.string()).optional()
});