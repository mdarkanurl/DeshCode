import { z } from "zod";

const createComments = z.object({
    userId: z.string(),
    discussionsId: z.string(),
    content: z.string().min(3).max(500)
});

export {
    createComments
}