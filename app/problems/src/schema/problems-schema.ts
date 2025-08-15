import { z } from "zod";
import { ProblemTypes } from "../generated/prisma";

const problemTypesEnum = z.enum([...(Object.values(ProblemTypes) as [string, ...string[]])]);

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
  problemTypes: problemTypesEnum,
  tags: z.array(z.string()).optional()
});

export const getProblemSchema = z.object({
    id: z.string()
});

export const submitSolutionSchema = z.object({
    userId: z.number(),
    problemId: z.string(),
    language: z.string().min(1).toLowerCase(),
    code: z.string().min(1)
});

export const updateProblemSchema = z.object({
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