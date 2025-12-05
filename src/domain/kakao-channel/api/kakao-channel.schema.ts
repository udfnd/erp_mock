import { z } from 'zod';

export const GetKakaoChannelsRequestSchema = z.object({
  jojikNanoId: z.string(),
});
export type GetKakaoChannelsRequest = z.infer<typeof GetKakaoChannelsRequestSchema>;

export const PaginationDataSchema = z.object({
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
  hasNextPage: z.boolean(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const KakaoChannelListItemSchema = z.object({
  kakaoChannelName: z.string(),
  channelSearchId: z.string(),
  createdAt: z.string(),
  isHwalseong: z.boolean(),
  nanoId: z.string(),
  name: z.string(),
});
export type KakaoChannelListItem = z.infer<typeof KakaoChannelListItemSchema>;

export const GetKakaoChannelsResponseSchema = z.object({
  kakaoChannels: z.array(KakaoChannelListItemSchema),
  paginationData: PaginationDataSchema.optional(),
});
export type GetKakaoChannelsResponse = z.infer<typeof GetKakaoChannelsResponseSchema>;

export const GetKakaoChannelDetailRequestSchema = z.object({
  jojikNanoId: z.string(),
});
export type GetKakaoChannelDetailRequest = z.infer<typeof GetKakaoChannelDetailRequestSchema>;

export const GetKakaoChannelDetailResponseSchema = z.object({
  kakaoChannelName: z.string(),
  channelSearchId: z.string(),
  createdAt: z.string(),
  isHwalseong: z.boolean(),
  nanoId: z.string(),
  name: z.string(),
});
export type GetKakaoChannelDetailResponse = z.infer<typeof GetKakaoChannelDetailResponseSchema>;

export const UpdateKakaoChannelRequestSchema = z.object({
  name: z.string(),
  isHwalseong: z.boolean(),
});
export type UpdateKakaoChannelRequest = z.infer<typeof UpdateKakaoChannelRequestSchema>;

export const UpdateKakaoChannelResponseSchema = GetKakaoChannelDetailResponseSchema;
export type UpdateKakaoChannelResponse = z.infer<typeof UpdateKakaoChannelResponseSchema>;
