import { z } from 'zod';

export const GetJaewonSincheongsRequestSchema = z.object({
  jojikNanoId: z.string(),
  jaewonSincheongSystemSangtaeFilters: z.array(z.string()).optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});
export type GetJaewonSincheongsRequest = z.infer<typeof GetJaewonSincheongsRequestSchema>;

export const PaginationDataSchema = z.object({
  hasNextPage: z.boolean(),
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const JaewonSincheongListItemSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  hadaProfileName: z.string(),
  createdAt: z.string(),
  jaewonSincheongSangtaeName: z.string(),
  jaewonSincheongSangtaeNanoId: z.string(),
  ballyeoByName: z.string().nullable(),
  surakByName: z.string().nullable(),
  surakAt: z.string().nullable(),
  ballyeoAt: z.string().nullable(),
});
export type JaewonSincheongListItem = z.infer<typeof JaewonSincheongListItemSchema>;

export const GetJaewonSincheongsResponseSchema = z.object({
  jaewonSincheongs: z.array(JaewonSincheongListItemSchema),
  paginationData: PaginationDataSchema.optional(),
});
export type GetJaewonSincheongsResponse = z.infer<typeof GetJaewonSincheongsResponseSchema>;

export const HaksaengProfileSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().nullable(),
  birthDate: z.string().nullable(),
});
export type HaksaengProfile = z.infer<typeof HaksaengProfileSchema>;

export const BohojaProfileSchema = z.object({
  name: z.string(),
  gwangye: z.string(),
  phoneNumber: z.string(),
  birthDate: z.string(),
});
export type BohojaProfile = z.infer<typeof BohojaProfileSchema>;

export const JaewonSincheongDetailResponseSchema = z.object({
  haksaengProfile: HaksaengProfileSchema,
  bohojaProfiles: z.array(BohojaProfileSchema),
  jaewonSincheongName: z.string(),
  jaewonSincheongSangtaeName: z.string(),
  jaewonSincheongSangtaeNanoId: z.string(),
  createdAt: z.string(),
});
export type JaewonSincheongDetailResponse = z.infer<typeof JaewonSincheongDetailResponseSchema>;

export const UpdateJaewonSincheongRequestSchema = z.object({
  jaewonsaengNanoId: z.string().nullable(),
});
export type UpdateJaewonSincheongRequest = z.infer<typeof UpdateJaewonSincheongRequestSchema>;

export const UpdateJaewonSincheongResponseSchema = z.object({
  jaewonsaengNanoId: z.string().nullable(),
});
export type UpdateJaewonSincheongResponse = z.infer<typeof UpdateJaewonSincheongResponseSchema>;

export const RejectJaewonSincheongResponseSchema = z.object({});
export type RejectJaewonSincheongResponse = z.infer<typeof RejectJaewonSincheongResponseSchema>;
