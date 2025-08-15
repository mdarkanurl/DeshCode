import { z } from "zod";
import { Topic } from "../generated/prisma";

export const createDiscuss = z.object({
    userId: z.string(),
    topic: z.enum([...(Object.values(Topic) as [string, ...string[]])]),
    title: z.string().min(5),
    content: z.string().min(10)
});

export const updateDiscuss = z.object({
    discussId: z.number(),
    title: z.string().min(5).optional(),
    content: z.string().min(10).optional()
});