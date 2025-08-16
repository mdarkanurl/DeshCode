import { z } from "zod";

export const submissionsSolutionSchema = z.object({
    userId: z.number(),
    problemsId: z.string(),
    language: z.string().min(1).toLowerCase(),
    code: z.string().min(1)
});