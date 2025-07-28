import { z } from "zod";
import { Topic } from "../generated/prisma";

export const createDiscuss = z.object({
    userId: z.string(),
    topic: z.enum(Topic),
    title: z.string().min(5),
    content: z.string().min(10)
});