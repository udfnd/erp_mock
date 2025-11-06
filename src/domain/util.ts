import { z } from 'zod';

export const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
