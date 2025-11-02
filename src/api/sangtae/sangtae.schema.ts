import { z } from 'zod';

export const NanoIdSchema = z.string().min(1, 'nanoId is required');
export type NanoId = z.infer<typeof NanoIdSchema>;

export const DeleteWorkTypeCustomSangtaeResponseSchema = z.object({});
export type DeleteWorkTypeCustomSangtaeResponse = z.infer<
  typeof DeleteWorkTypeCustomSangtaeResponseSchema
>;

export const DeleteEmploymentCategorySangtaeResponseSchema = z.object({});
export type DeleteEmploymentCategorySangtaeResponse = z.infer<
  typeof DeleteEmploymentCategorySangtaeResponseSchema
>;
