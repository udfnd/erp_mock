import { z } from 'zod';

export const HadaAllimInfoSchema = z.object({
  hadaAllimChannelNanoId: z.string(),
  isPushNotification: z.boolean(),
  sendScheduleAt: z.string().nullable(),
});
export type HadaAllimInfo = z.infer<typeof HadaAllimInfoSchema>;

export const SmsBalsinInfoSchema = z.object({
  smsBalsinBunhoNanoId: z.string(),
  sendScehduleAt: z.string().nullable(),
  isSendIfFailed: z.boolean(),
  susinPhoneNumber: z.string().optional(),
});
export type SmsBalsinInfo = z.infer<typeof SmsBalsinInfoSchema>;

export const EmailBalsinInfoSchema = z.object({
  balsinjaNanoId: z.string(),
  sendScheduleAt: z.string().nullable(),
  isSendIfFailed: z.boolean(),
  susinEmailAddress: z.string().optional(),
});
export type EmailBalsinInfo = z.infer<typeof EmailBalsinInfoSchema>;

export const KakaoBalsinInfoSchema = z.object({
  kakaoChannelNanoId: z.string(),
  sendScheduleAt: z.string().nullable(),
  isSendIfFailed: z.boolean(),
  susinPhoneNumber: z.string().optional(),
});
export type KakaoBalsinInfo = z.infer<typeof KakaoBalsinInfoSchema>;

export const BalsinSangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type BalsinSangtae = z.infer<typeof BalsinSangtaeSchema>;

const SmsBalsinInfoWithSusinSchema = SmsBalsinInfoSchema.extend({
  susinPhoneNumber: z.string(),
});

const EmailBalsinInfoWithSusinSchema = EmailBalsinInfoSchema.extend({
  susinEmailAddress: z.string(),
});

const KakaoBalsinInfoWithSusinSchema = KakaoBalsinInfoSchema.extend({
  susinPhoneNumber: z.string(),
});

export const GetJojikAllimsRequestSchema = z.object({
  jojikNanoId: z.string(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});
export type GetJojikAllimsRequest = z.infer<typeof GetJojikAllimsRequestSchema>;

export const PaginationDataSchema = z.object({
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
  hasNextPage: z.boolean(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const AllimTypeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type AllimType = z.infer<typeof AllimTypeSchema>;

export const JojikAllimListItemSchema = z.object({
  nanoId: z.string(),
  title: z.string(),
  jaewonsaengName: z.string().nullable(),
  jaewonsaengNanoId: z.string().nullable(),
  allimTemplateName: z.string().nullable(),
  allimTemplateNanoId: z.string().nullable(),
  createdByName: z.string(),
  createdAt: z.string(),
  hadaViewedAt: z.string().nullable(),
  kakaoBalsinSangtae: BalsinSangtaeSchema.nullable(),
  emailBalsinSangtae: BalsinSangtaeSchema.nullable(),
  hadaBalsinSangtae: BalsinSangtaeSchema.nullable(),
  smsBalsinSangtae: BalsinSangtaeSchema.nullable(),
  allimType: AllimTypeSchema,
});
export type JojikAllimListItem = z.infer<typeof JojikAllimListItemSchema>;

export const GetJojikAllimsResponseSchema = z.object({
  paginationData: PaginationDataSchema.optional(),
  allims: z.array(JojikAllimListItemSchema),
});
export type GetJojikAllimsResponse = z.infer<typeof GetJojikAllimsResponseSchema>;

export const CreateJojikAllimRequestSchema = z.object({
  jaewonsaengNanoId: z.string(),
  jojikNanoId: z.string(),
  hadaProfileSikbyeolja: z.number(),
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  hadaAllimInfo: HadaAllimInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
});
export type CreateJojikAllimRequest = z.infer<typeof CreateJojikAllimRequestSchema>;

export const CreateJojikAllimResponseSchema = z.object({
  jaewonsaengNanoId: z.string(),
  hadaProfileSikbyeolja: z.number(),
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  hadaAllimInfo: HadaAllimInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
});
export type CreateJojikAllimResponse = z.infer<typeof CreateJojikAllimResponseSchema>;

export const CreateJojikTemplateAllimRequestSchema = z.object({
  jaewonsaengNanoId: z.string(),
  jojikNanoId: z.string(),
  hadaProfileSikbyeolja: z.number(),
  allimTypeNanoId: z.string(),
  hadaAllimInfo: HadaAllimInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
  allimTemplateNanoId: z.string(),
  allimTemplateParameterInput: z.string(),
});
export type CreateJojikTemplateAllimRequest = z.infer<typeof CreateJojikTemplateAllimRequestSchema>;

export const CreateJojikTemplateAllimResponseSchema = z.object({
  jaewonsaengNanoId: z.string(),
  hadaProfileSikbyeolja: z.number(),
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  hadaAllimInfo: HadaAllimInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
  allimTemplateNanoId: z.string().nullable(),
  allimTemplateParameterInput: z.string().nullable(),
});
export type CreateJojikTemplateAllimResponse = z.infer<
  typeof CreateJojikTemplateAllimResponseSchema
>;

export const CreateJojikBejaewonsaengAllimRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  smsBalsinInfo: SmsBalsinInfoWithSusinSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoWithSusinSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoWithSusinSchema.nullable(),
  jojikNanoId: z.string(),
});
export type CreateJojikBejaewonsaengAllimRequest = z.infer<
  typeof CreateJojikBejaewonsaengAllimRequestSchema
>;

export const CreateJojikBejaewonsaengAllimResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
  nanoId: z.string(),
});
export type CreateJojikBejaewonsaengAllimResponse = z.infer<
  typeof CreateJojikBejaewonsaengAllimResponseSchema
>;

export const CreateJojikBejaewonsaengTemplateAllimRequestSchema = z.object({
  allimTypeNanoId: z.string(),
  smsBalsinInfo: SmsBalsinInfoWithSusinSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoWithSusinSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoWithSusinSchema.nullable(),
  allimTemplateNanoId: z.string(),
  allimTemplateParameterInput: z.string(),
  jojikNanoId: z.string(),
});
export type CreateJojikBejaewonsaengTemplateAllimRequest = z.infer<
  typeof CreateJojikBejaewonsaengTemplateAllimRequestSchema
>;

export const CreateJojikBejaewonsaengTemplateAllimResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  allimTypeNanoId: z.string(),
  smsBalsinInfo: SmsBalsinInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinInfoSchema.nullable(),
  allimTemplateNanoId: z.string(),
  allimTemplateParameterInput: z.string(),
  nanoId: z.string(),
});
export type CreateJojikBejaewonsaengTemplateAllimResponse = z.infer<
  typeof CreateJojikBejaewonsaengTemplateAllimResponseSchema
>;

export const HadaAllimDetailInfoSchema = z.object({
  hadaAllimChannelNanoId: z.string(),
  hadaAllimChannelName: z.string(),
  balsinSangtaeName: z.string(),
  balsinSangtaeNanoId: z.string(),
  isPushNotification: z.boolean(),
  sendScheduleAt: z.string().nullable(),
  sentAt: z.string().nullable(),
});
export type HadaAllimDetailInfo = z.infer<typeof HadaAllimDetailInfoSchema>;

export const SmsBalsinDetailInfoSchema = z.object({
  smsBalsinBunhoNanoId: z.string(),
  smsBalsinBunhoName: z.string(),
  smsBalsinBunhoNumber: z.string(),
  balsinSangtaeName: z.string(),
  balsinSangtaeNanoId: z.string(),
  isSendIfFailed: z.boolean(),
  sendScehduleAt: z.string().nullable(),
  sentAt: z.string().nullable(),
});
export type SmsBalsinDetailInfo = z.infer<typeof SmsBalsinDetailInfoSchema>;

export const EmailBalsinDetailInfoSchema = z.object({
  balsinjaNanoId: z.string(),
  balsinjaName: z.string(),
  balsinSangtaeName: z.string(),
  balsinSangtaeNanoId: z.string(),
  isSendIfFailed: z.boolean(),
  sendScheduleAt: z.string().nullable(),
  sentAt: z.string().nullable(),
});
export type EmailBalsinDetailInfo = z.infer<typeof EmailBalsinDetailInfoSchema>;

export const KakaoBalsinDetailInfoSchema = z.object({
  kakaoChannelNanoId: z.string(),
  kakaoChannelName: z.string(),
  isSendIfFailed: z.boolean(),
  balsinSangtaeNanoId: z.string(),
  balsinSangtaeName: z.string(),
  sendScheduleAt: z.string().nullable(),
  sentAt: z.string().nullable(),
});
export type KakaoBalsinDetailInfo = z.infer<typeof KakaoBalsinDetailInfoSchema>;

export const GetJojikAllimDetailResponseSchema = z.object({
  jaewonsaengNanoId: z.string().nullable(),
  hadaProfileSikbyeolja: z.string().nullable(),
  hadaViewedAt: z.string().nullable(),
  allimTypeNanoId: z.string(),
  allimTypeName: z.string(),
  hadaAllimInfo: HadaAllimDetailInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinDetailInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinDetailInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinDetailInfoSchema.nullable(),
  allimTemplateNanoId: z.string().nullable(),
  allimTemplateName: z.string().nullable(),
  allimTemplateParameterInput: z.string().nullable(),
  title: z.string(),
  content: z.string(),
});
export type GetJojikAllimDetailResponse = z.infer<typeof GetJojikAllimDetailResponseSchema>;

export const UpdateJojikAllimRequestSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  allimTemplateNanoId: z.string().optional(),
  allimTemplateParameterInput: z.string().optional(),
  allimTypeNanoId: z.string().optional(),
  hadaAllimChannelNanoId: z.string().optional(),
  hadaAllimSendScehduleAt: z.string().optional(),
  isHwalseong: z.boolean().optional(),
  cancelHadaAllim: z.boolean().optional(),
  cancelSmsBalsin: z.boolean().optional(),
  cancelKakaoBalsin: z.boolean().optional(),
  cancelEmailBalsin: z.boolean().optional(),
});
export type UpdateJojikAllimRequest = z.infer<typeof UpdateJojikAllimRequestSchema>;

export const UpdateJojikAllimResponseSchema = z.object({
  jaewonsaengNanoId: z.string().nullable(),
  hadaProfileSikbyeolja: z.string().nullable(),
  hadaViewedAt: z.string().nullable(),
  allimTypeNanoId: z.string(),
  allimTypeName: z.string(),
  hadaAllimInfo: HadaAllimDetailInfoSchema.nullable(),
  smsBalsinInfo: SmsBalsinDetailInfoSchema.nullable(),
  emailBalsinInfo: EmailBalsinDetailInfoSchema.nullable(),
  kakaoBalsinInfo: KakaoBalsinDetailInfoSchema.nullable(),
  allimTemplateNanoId: z.string().nullable(),
  allimTemplateName: z.string().nullable(),
  allimTemplateParameterInput: z.string().nullable(),
});
export type UpdateJojikAllimResponse = z.infer<typeof UpdateJojikAllimResponseSchema>;
