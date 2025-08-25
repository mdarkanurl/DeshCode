import { z } from 'zod';

export const createContests = z
  .object({
    name: z.string().min(5),
    description: z.string().min(10).optional(),
    problemsId: z.array(z.string()).min(1).max(4),
    startTime: z
      .string()
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val),
        "Start time must be in UTC"
      )
      .transform((val) => new Date(val)),
    endTime: z
      .string()
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val),
        "End time must be in UTC"
      )
      .transform((val) => new Date(val)),
  })
  .superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        path: ["endTime"],
        message: "End time must be after start time",
        code: "custom",
      });
    }
  });
