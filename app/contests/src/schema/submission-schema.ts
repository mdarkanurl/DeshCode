import { z } from "zod";

export const submissionsSolution = z.object({
    contestId: z.string(),
    participantId: z.string().optional(),
    problemId: z.string(),
    language: z.string().toLowerCase(),
    code: z.string()
});