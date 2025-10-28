import { z } from 'zod';

export const JojikListItemSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  nanoId: z.string(),
});
export type JojikListItem = z.infer<typeof JojikListItemSchema>;

export const GetJojiksResponseSchema = z.object({
  jojiks: z.array(JojikListItemSchema),
});
export type GetJojiksResponse = z.infer<typeof GetJojiksResponseSchema>;

export const CreateJojikRequestSchema = z.object({
  name: z.string(),
  gigwanNanoId: z.string(),
});
export type CreateJojikRequest = z.infer<typeof CreateJojikRequestSchema>;

export const CreateJojikResponseSchema = z.object({
  nanoId: z.string(),
});
export type CreateJojikResponse = z.infer<typeof CreateJojikResponseSchema>;

export const JojikOpenFileSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});

export const JojikDetailResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  intro: z.string(),
  jaewonsaengLinkRequestUrl: z.string(),
  openSangtae: z.string(),
  openSangtaeNanoId: z.string(),
  canAccessOpenFileSangtae: z.string(),
  canAccessOpenFileSangtaeNanoId: z.string(),
  canHadaLinkRequestSangtae: z.string(),
  canHadaLinkRequestSangtaeNanoId: z.string(),
  homepageUrl: z.string(),
  openFiles: z.array(JojikOpenFileSchema),
});
export type JojikDetailResponse = z.infer<typeof JojikDetailResponseSchema>;

export const UpdateJojikRequestSchema = z.object({
  name: z.string().optional(),
  intro: z.string().optional(),
  juso: z.string().optional(),
  openSangtaeNanoId: z.string().optional(),
  canAccessOpenFileSangtaeNanoId: z.string().optional(),
  canHadaLinkRequestSangtaeNanoId: z.string().optional(),
  openFileNanoIds: z.array(z.string()),
});
export type UpdateJojikRequest = z.infer<typeof UpdateJojikRequestSchema>;

export const UpdateJojikResponseSchema = JojikDetailResponseSchema;
export type UpdateJojikResponse = z.infer<typeof UpdateJojikResponseSchema>;

export const DeleteJojikResponseSchema = z.object({});
export type DeleteJojikResponse = z.infer<typeof DeleteJojikResponseSchema>;

export const JojikPermissionSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  systemType: z.string(),
});
export const GetJojikPermissionsResponseSchema = z.object({
  permissions: z.array(JojikPermissionSchema),
});
export type GetJojikPermissionsResponse = z.infer<typeof GetJojikPermissionsResponseSchema>;

export const GetJojikSettingSidebarResponseSchema = z.object({
  name: z.string(),
  homepageUrl: z.string(),
  nanoId: z.string(),
});
export type GetJojikSettingSidebarResponse = z.infer<typeof GetJojikSettingSidebarResponseSchema>;

export const UpsertJojikAddressRequestSchema = z.object({
  address: z.string(),
});
export type UpsertJojikAddressRequest = z.infer<typeof UpsertJojikAddressRequestSchema>;
export const UpsertJojikAddressResponseSchema = z.object({
  address: z.string(),
  nanoId: z.string(),
});
export type UpsertJojikAddressResponse = z.infer<typeof UpsertJojikAddressResponseSchema>;

export const UpdateJojikNameRequestSchema = z.object({
  name: z.string(),
});
export type UpdateJojikNameRequest = z.infer<typeof UpdateJojikNameRequestSchema>;
export const UpdateJojikNameResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type UpdateJojikNameResponse = z.infer<typeof UpdateJojikNameResponseSchema>;

export const UpdateJojikIntroRequestSchema = z.object({
  intro: z.string(),
});
export type UpdateJojikIntroRequest = z.infer<typeof UpdateJojikIntroRequestSchema>;
export const UpdateJojikIntroResponseSchema = z.object({
  intro: z.string(),
  nanoId: z.string(),
});
export type UpdateJojikIntroResponse = z.infer<typeof UpdateJojikIntroResponseSchema>;

export const UpdateJojikSchoolsRequestSchema = z.object({
  schools: z.array(z.string()),
});
export type UpdateJojikSchoolsRequest = z.infer<typeof UpdateJojikSchoolsRequestSchema>;
export const UpdateJojikSchoolsResponseSchema = z.object({
  schools: z.array(z.object({ name: z.string(), nanoId: z.string() })),
});
export type UpdateJojikSchoolsResponse = z.infer<typeof UpdateJojikSchoolsResponseSchema>;

export const UpdateJojikOpenSettingRequestSchema = z.object({
  canAccessBasicInfoNanoId: z.string(),
  canAccessOpenFileNanoId: z.string(),
  canAccessHadaLinkRequestNanoId: z.string(),
});
export type UpdateJojikOpenSettingRequest = z.infer<typeof UpdateJojikOpenSettingRequestSchema>;
export const UpdateJojikOpenSettingResponseSchema = z.object({
  canAccessBasicInfo: z.string(),
  canAccessOpenFile: z.object({ nanoId: z.string(), name: z.string() }),
  canAccessHadaLinkRequest: z.object({ nanoId: z.string(), name: z.string() }),
  nanoId: z.string(),
});
export type UpdateJojikOpenSettingResponse = z.infer<typeof UpdateJojikOpenSettingResponseSchema>;

export const UpsertJojikHomepageRequestSchema = z.object({
  url: z.string(),
});
export type UpsertJojikHomepageRequest = z.infer<typeof UpsertJojikHomepageRequestSchema>;
export const UpsertJojikHomepageResponseSchema = z.object({
  nanoId: z.string(),
  url: z.string(),
});
export type UpsertJojikHomepageResponse = z.infer<typeof UpsertJojikHomepageResponseSchema>;
