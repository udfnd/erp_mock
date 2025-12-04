import { z } from 'zod';

export const GetJojikMunuisRequestSchema = z.object({
  jojikNanoId: z.string(),
  titleSearch: z.string().optional(),
  pageSize: z.string().optional(),
  pageNumber: z.string().optional(),
  sortByOption: z.string().optional(),
});
export type GetJojikMunuisRequest = z.infer<typeof GetJojikMunuisRequestSchema>;

export const JojikMunuiDapbyeonListSchema = z.object({
  dapbyeonByName: z.string().nullable(),
  dapbyeonAt: z.string().nullable(),
  viewedAt: z.string().nullable(),
});
export type JojikMunuiDapbyeonList = z.infer<typeof JojikMunuiDapbyeonListSchema>;

export const JojikMunuiListItemSchema = z.object({
  title: z.string(),
  nanoId: z.string(),
  jaewonsaengName: z.string(),
  gwangye: z.string().nullable(),
  createdAt: z.string(),
  jojikMunuiSangtaeName: z.string(),
  jojikMunuiSangtaeNanoId: z.string(),
  linkedJojikMunuiNanoId: z.string().nullish(),
  linkedJojikAllimNanoId: z.string().nullish(),
  dapbyeon: JojikMunuiDapbyeonListSchema,
});
export type JojikMunuiListItem = z.infer<typeof JojikMunuiListItemSchema>;

export const GetJojikMunuisResponseSchema = z.object({
  jojikMunuis: z.array(JojikMunuiListItemSchema),
});
export type GetJojikMunuisResponse = z.infer<typeof GetJojikMunuisResponseSchema>;

export const JojikMunuiDapbyeonDetailSchema = z.object({
  dapbyeonContent: z.string().nullable(),
  dapbyeonAt: z.string().nullable(),
  dapbyeonGesiAt: z.string().nullable(),
  dapbyeonViewedAt: z.string().nullable(),
  dapbyeonByNanoId: z.string().nullable(),
  dapbyeonChwisoByNanoId: z.string().nullable(),
  dapbyeonChwisoAt: z.string().nullable(),
});
export type JojikMunuiDapbyeonDetail = z.infer<typeof JojikMunuiDapbyeonDetailSchema>;

export const GetJojikMunuiDetailResponseSchema = z.object({
  nanoId: z.string(),
  title: z.string(),
  content: z.string(),
  jaewonsaengNanoId: z.string(),
  jojikMunuiSangtaeName: z.string(),
  jojikMunuiSangtaeNanoId: z.string(),
  createdAt: z.string(),
  jojikNanoId: z.string(),
  linkedMunuiNanoId: z.string().nullish(),
  linkedAllimNanoId: z.string().nullish(),
  dapbyeon: JojikMunuiDapbyeonDetailSchema,
});
export type GetJojikMunuiDetailResponse = z.infer<typeof GetJojikMunuiDetailResponseSchema>;

export const UpdateJojikMunuiRequestSchema = z.object({
  dapbyeonContent: z.string().nullable().optional(),
  munuiSangtae: z.enum(['gesi', 'chwiso', 'miGesi']),
});
export type UpdateJojikMunuiRequest = z.infer<typeof UpdateJojikMunuiRequestSchema>;

export const UpdateJojikMunuiResponseSchema = GetJojikMunuiDetailResponseSchema;
export type UpdateJojikMunuiResponse = z.infer<typeof UpdateJojikMunuiResponseSchema>;
