import { z } from "zod";

export const createPaticipants = z.object({
    contestId: z.string(),
    userId: z.string()
});