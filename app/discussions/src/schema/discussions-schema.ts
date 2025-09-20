import { z } from "zod";
import { Topic } from "@prisma/client";

export const createDiscussions = z.object({
    userId: z.string(),
    topic: z.enum([...(Object.values(Topic) as [string, ...string[]])]),
    title: z.string().min(5),
    content: z.string().min(10)
});

export const updateDiscussions = z.object({
    userId: z.string(),
    discussionsId: z.string(),
    title: z.string().min(5).optional(),
    content: z.string().min(10).optional()
});