import { z } from 'zod';

export const AllimTypeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type AllimType = z.infer<typeof AllimTypeSchema>;

export const GetAllimTypesResponseSchema = z.object({
  allimTypes: z.array(AllimTypeSchema),
});
export type GetAllimTypesResponse = z.infer<typeof GetAllimTypesResponseSchema>;
