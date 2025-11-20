import { z } from 'zod';

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

export const IconSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type Icon = z.infer<typeof IconSchema>;

export const HomepageLinkSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  linkUrl: z.string(),
  titleName: z.string(),
  icon: IconSchema,
});
export type HomepageLink = z.infer<typeof HomepageLinkSchema>;

export const JojikOpenFileSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type JojikOpenFile = z.infer<typeof JojikOpenFileSchema>;

export const JojikListItemSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  nanoId: z.string(),
});
export type JojikListItem = z.infer<typeof JojikListItemSchema>;

export const GetJojiksRequestSchema = z.object({
  gigwanNanoId: z.string(),
  jojikNameSearch: z.string().optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});
export type GetJojiksRequest = z.infer<typeof GetJojiksRequestSchema>;

export const GetJojiksResponseSchema = z
  .object({
    paginationData: PaginationDataSchema.optional(),
    jojiks: z.array(JojikListItemSchema),
  })
  .passthrough();
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

export const JojikDetailResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  intro: z.string().nullable(),
  jaewonsaengLinkRequestUrl: z.string(),
  openSangtae: z.boolean(),
  canAccessOpenFileSangtae: z.string(),
  canHadaLinkRequestSangtae: z.string(),
  homepageUrl: HomepageLinkSchema.nullable(),
  openFiles: z.array(JojikOpenFileSchema),
  juso: z
    .object({
      nanoId: z.string(),
      name: z.string(),
      juso: z.string(),
      jusoDetail: z.string(),
    })
    .nullable(),
});
export type JojikDetailResponse = z.infer<typeof JojikDetailResponseSchema>;

export const UpdateJojikRequestSchema = z.object({
  name: z.string().optional(),
  intro: z.string().optional(),
  jusoNanoId: z.string().nullable().optional(),
  openSangtae: z.boolean().optional(),
  canAccessOpenFileSangtaeNanoId: z.string().optional(),
  canHadaLinkRequestSangtaeNanoId: z.string().optional(),
  homepageUrlNanoId: z.string().nullable().optional(),
  logoImageNanoId: z.string().nullable().optional(),
  openFileNanoIds: z.array(z.string()).optional(),
});
export type UpdateJojikRequest = z.infer<typeof UpdateJojikRequestSchema>;

export const UpdateJojikResponseSchema = JojikDetailResponseSchema;
export type UpdateJojikResponse = z.infer<typeof UpdateJojikResponseSchema>;

export const DeleteJojikResponseSchema = z.object({});
export type DeleteJojikResponse = z.infer<typeof DeleteJojikResponseSchema>;

export const JojikPermissionSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  sysPermissionType: z.string(),
});
export type JojikPermission = z.infer<typeof JojikPermissionSchema>;

export const GetJojikPermissionsResponseSchema = z.object({
  permissions: z.array(JojikPermissionSchema),
});
export type GetJojikPermissionsResponse = z.infer<typeof GetJojikPermissionsResponseSchema>;

export const GetJojikSettingSidebarResponseSchema = z.object({
  name: z.string(),
  homepageUrl: z.string(),
  nanoId: z.string(),
});
export type GetJojikSettingSidebarResponse = z.infer<
  typeof GetJojikSettingSidebarResponseSchema
>;

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
export type UpdateJojikOpenSettingResponse = z.infer<
  typeof UpdateJojikOpenSettingResponseSchema
>;

export const UpsertJojikHomepageRequestSchema = z.object({
  url: z.string(),
});
export type UpsertJojikHomepageRequest = z.infer<typeof UpsertJojikHomepageRequestSchema>;

export const UpsertJojikHomepageResponseSchema = z.object({
  nanoId: z.string(),
  url: z.string(),
});
export type UpsertJojikHomepageResponse = z.infer<typeof UpsertJojikHomepageResponseSchema>;
