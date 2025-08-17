import { z } from 'zod';

export const createContests = z.object({
  name: z.string().min(5),
  description: z.string().min(10).optional(),
  problemIds: z.array(z.string()).min(1).max(4),
  startTime: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  endTime: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date())
});