import { z } from "zod";

export const submissionsSolution = z.object({
    contestId: z.string(),
    participantId: z.string(),
    problemId: z.string(),
    language: z.string().toLowerCase(),
    code: z.string()
});