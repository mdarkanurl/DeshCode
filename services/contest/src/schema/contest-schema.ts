import { z } from "zod";

export const createContest = z.object({
    name: z.string().min(5),
    description: z.string().min(10).optional(),
    rules: z.string().min(5).optional(),
    problemIds: z.array(z.string()).min(1).max(4),
    startTime: z.date(),
    endTime: z.date()
});