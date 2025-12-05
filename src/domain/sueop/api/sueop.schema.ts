import { z } from 'zod';

export const GetSueopsRequestSchema = z.object({
  jojikNanoId: z.string(),
  sueopSystemSangtaeFilters: z.array(z.string()).optional(),
  isHwalseongFilter: z.array(z.string()).optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.string().optional(),
});
export type GetSueopsRequest = z.infer<typeof GetSueopsRequestSchema>;

export const PaginationDataSchema = z.object({
  hasNextPage: z.boolean(),
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const SueopListItemSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sueopSystemSangtaeName: z.string(),
  sueopSystemSangtaeNanoId: z.string(),
  ownerJojikName: z.string(),
  isGongyued: z.boolean(),
  sugangsaengCount: z.number(),
  gaegangAt: z.string(),
  gaegangIljeongNanoId: z.string(),
  jonggangAt: z.string(),
  jonggangIlejeongNanoId: z.string(),
  jeongwon: z.number(),
});
export type SueopListItem = z.infer<typeof SueopListItemSchema>;

export const GetSueopsResponseSchema = z.object({
  sueops: z.array(SueopListItemSchema),
  paginationData: PaginationDataSchema.optional(),
});
export type GetSueopsResponse = z.infer<typeof GetSueopsResponseSchema>;

export const CreateSueopRequestSchema = z.object({
  jojikNanoId: z.string(),
  name: z.string(),
  sueopSystemSangtaeNanoId: z.string(),
  gaegangIljeongNanoId: z.string(),
  jonggangIljeongNanoId: z.string(),
  jeongwon: z.number().nullable(),
  sueopIntro: z.string().nullable(),
});
export type CreateSueopRequest = z.infer<typeof CreateSueopRequestSchema>;

export const IljeongScheduleSchema = z.object({
  startAt: z.string(),
  endAt: z.string(),
});
export type IljeongSchedule = z.infer<typeof IljeongScheduleSchema>;

export const IljeongSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  at: z.string().nullable(),
  recurrenceRule: z.string().nullable(),
  startAt: z.string().nullable(),
  endAt: z.string().nullable(),
  iljeongTypeName: z.string(),
  iljeongTypeNanoId: z.string(),
  schedules: z.array(IljeongScheduleSchema),
});
export type Iljeong = z.infer<typeof IljeongSchema>;

export const CreateSueopResponseSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sueopSystemSangtaeNanoId: z.string(),
  sueopSystemSangtaeName: z.string(),
  jonggangIljeong: IljeongSchema,
  gaegangIljeong: IljeongSchema,
  sueopIntro: z.string().nullable(),
  jeongwon: z.string().nullable(),
  createdAt: z.string(),
  ownerJojikName: z.string(),
});
export type CreateSueopResponse = z.infer<typeof CreateSueopResponseSchema>;

export const GetSueopDetailResponseSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sueopSystemSangtaeNanoId: z.string(),
  sueopSystemSangtaeName: z.string(),
  jonggangIljeong: IljeongSchema,
  gaegangIljeong: IljeongSchema,
  jeongwon: z.number().nullable(),
  sueopIntro: z.string().nullable(),
  createdAt: z.string(),
  isGongyued: z.boolean(),
  ownerJojikName: z.string(),
  isHwalseong: z.boolean(),
});
export type GetSueopDetailResponse = z.infer<typeof GetSueopDetailResponseSchema>;

export const UpdateSueopRequestSchema = z.object({
  jojikNanoId: z.string(),
  name: z.string().optional(),
  sueopSystemSangtaeNanoId: z.string().optional(),
  jonggangIljeongNanoId: z.string().optional(),
  gaegangIljeongNanoId: z.string().optional(),
  jeongwon: z.number().nullable().optional(),
  sueopIntro: z.string().nullable().optional(),
  isHwalseong: z.boolean().optional(),
});
export type UpdateSueopRequest = z.infer<typeof UpdateSueopRequestSchema>;

export const UpdateSueopResponseSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sueopSystemSangtaeNanoId: z.string(),
  sueopSystemSangtaeName: z.string(),
  jonggangIljeong: IljeongSchema,
  gaegangIljeong: IljeongSchema,
  jeongwon: z.number().nullable(),
  sueopIntro: z.string().nullable(),
  createdAt: z.string(),
  isGongyued: z.boolean(),
  ownerJojikName: z.string(),
  isHwalseong: z.boolean(),
});
export type UpdateSueopResponse = z.infer<typeof UpdateSueopResponseSchema>;

export const DeleteSueopResponseSchema = z.object({});
export type DeleteSueopResponse = z.infer<typeof DeleteSueopResponseSchema>;
