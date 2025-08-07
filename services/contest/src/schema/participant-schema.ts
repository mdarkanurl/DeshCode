import { z } from "zod";

export const createPaticipant = z.object({
    contestId: z.string(),
    userId: z.string()
});