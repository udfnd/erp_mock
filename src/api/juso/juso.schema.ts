import { z } from 'zod';

export const GetJusosRequestSchema = z.object({
  gigwanNanoId: z.string(),
  jusoNameSearch: z.string().optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});
export type GetJusosRequest = z.infer<typeof GetJusosRequestSchema>;

export const PaginationDataSchema = z
  .object({
    hasNextPage: z.boolean(),
    pageItemCount: z.number(),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalItemCount: z.number(),
    totalPageCount: z.number(),
  })
  .passthrough();
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const JusoListItemSchema = z.object({
  createdBy: z.string(),
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
  createdAt: z.string(),
  nanoId: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});
export type JusoListItem = z.infer<typeof JusoListItemSchema>;

export const GetJusosResponseSchema = z
  .object({
    paginationData: PaginationDataSchema.optional(),
    jusos: z.array(JusoListItemSchema),
  })
  .passthrough();
export type GetJusosResponse = z.infer<typeof GetJusosResponseSchema>;

export const CreateJusoRequestSchema = z.object({
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
  gigwanNanoId: z.string(),
  jojikNanoId: z.string().optional(),
});
export type CreateJusoRequest = z.infer<typeof CreateJusoRequestSchema>;

export const CreateJusoResponseSchema = z.object({
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
  nanoId: z.string(),
});
export type CreateJusoResponse = z.infer<typeof CreateJusoResponseSchema>;

export const GetJusoDetailResponseSchema = z.object({
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
  nanoId: z.string(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
});
export type GetJusoDetailResponse = z.infer<typeof GetJusoDetailResponseSchema>;

export const UpdateJusoRequestSchema = z.object({
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
});
export type UpdateJusoRequest = z.infer<typeof UpdateJusoRequestSchema>;

export const UpdateJusoResponseSchema = z.object({
  jusoName: z.string(),
  jusoDetail: z.string(),
  juso: z.string(),
  nanoId: z.string(),
});
export type UpdateJusoResponse = z.infer<typeof UpdateJusoResponseSchema>;

export const DeleteJusoResponseSchema = z.object({});
export type DeleteJusoResponse = z.infer<typeof DeleteJusoResponseSchema>;
