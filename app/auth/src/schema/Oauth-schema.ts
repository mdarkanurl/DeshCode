import { z } from "zod";

export const OauthSchema = z.object({
    id: z.string()
});