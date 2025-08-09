import { string, z } from "zod";
import { SubmitStatus } from "../generated/prisma";
const problemTypesEnum = z.enum([...(Object.values(SubmitStatus) as [string, ...string[]])]);

export const submitSolution = z.object({
    contestId: z.string(),
    participantId: z.string(),
    problemId: z.string(),
    language: z.string(),
    code: z.string()
});