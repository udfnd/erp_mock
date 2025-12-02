import { z } from 'zod';

export const PaginationDataSchema = z.object({
  hasNextPage: z.boolean(),
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const GetJaewonsaengsRequestSchema = z.object({
  jojikNanoId: z.string(),
  jaewonsaengNameSearch: z.string().optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
});
export type GetJaewonsaengsRequest = z.infer<typeof GetJaewonsaengsRequestSchema>;

export const JaewonsaengListItemSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  boninPhoneNumber: z.string().nullable(),
  bohojaPhoneNumberFirst: z.string().nullable(),
  bohojaPhoneNumberSecond: z.string().nullable(),
  jaewonCategorySangtaeName: z.string(),
  jaewonCategorySangtaeNanoId: z.string(),
  isHadaLinked: z.boolean(),
  daepyoJaewonsaengGroupName: z.string().nullable(),
  daepyoJaewonsaengGroupNanoId: z.string().nullable(),
  isHwalseong: z.boolean(),
  memo: z.string().nullable().optional(),
  sueops: z
    .array(
      z.object({
        name: z.string(),
        startedAt: z.string().nullable().optional(),
      }),
    )
    .optional(),
});
export type JaewonsaengListItem = z.infer<typeof JaewonsaengListItemSchema>;

export const GetJaewonsaengsResponseSchema = z.object({
  jaewonsaengs: z.array(JaewonsaengListItemSchema),
  paginationData: PaginationDataSchema.optional(),
});
export type GetJaewonsaengsResponse = z.infer<typeof GetJaewonsaengsResponseSchema>;

export const CreateJaewonsaengBoninRequestSchema = z.object({
  name: z.string(),
  birthDate: z.string().nullable(),
  genderNanoId: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string(),
  bigo: z.string().nullable(),
});
export type CreateJaewonsaengBoninRequest = z.infer<typeof CreateJaewonsaengBoninRequestSchema>;

export const CreateJaewonsaengBohojaInnerSchema = z.object({
  gwangye: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  bigo: z.string().nullable(),
});
export type CreateJaewonsaengBohojaInner = z.infer<typeof CreateJaewonsaengBohojaInnerSchema>;

export const CreateJaewonsaengRequestSchema = z.object({
  jojikNanoId: z.string(),
  jaewonsaengBonin: CreateJaewonsaengBoninRequestSchema,
  jaewonsaengBohojas: z.array(CreateJaewonsaengBohojaInnerSchema),
  jaewonsaeng: z.object({
    jaewonCategorySangtaeNanoId: z.string(),
    name: z.string(),
    nickname: z.string().nullable(),
  }),
});
export type CreateJaewonsaengRequest = z.infer<typeof CreateJaewonsaengRequestSchema>;

export const CreateJaewonsaengResponseSchema = z.object({
  jaewonsaeng: z.object({
    nanoId: z.string(),
    jaewonCategorySangtaeName: z.string(),
    jaewonCategorySangtaeNanoId: z.string(),
    name: z.string(),
    nickname: z.string(),
    isHwalseong: z.boolean(),
  }),
});
export type CreateJaewonsaengResponse = z.infer<typeof CreateJaewonsaengResponseSchema>;

export const GetJaewonsaengDetailResponseSchema = z.object({
  name: z.string(),
  nickname: z.string().nullable(),
  nanoId: z.string(),
  jaewonCategorySangtaeName: z.string(),
  jaewonCategorySangtaeNanoId: z.string(),
  isHadaLinked: z.boolean(),
  daepyoJaewonsaengGroupName: z.string().nullable(),
  daepyoJaewonsaengGroupNanoId: z.string().nullable(),
  isHwalseong: z.boolean(),
});
export type GetJaewonsaengDetailResponse = z.infer<typeof GetJaewonsaengDetailResponseSchema>;

export const UpdateJaewonsaengRequestSchema = z.object({
  name: z.string(),
  jaewonCategorySangtaeNanoId: z.string(),
  nickname: z.string().nullable(),
  isHwalseong: z.boolean(),
});
export type UpdateJaewonsaengRequest = z.infer<typeof UpdateJaewonsaengRequestSchema>;

export const UpdateJaewonsaengResponseSchema = GetJaewonsaengDetailResponseSchema;
export type UpdateJaewonsaengResponse = z.infer<typeof UpdateJaewonsaengResponseSchema>;

export const DeleteJaewonsaengResponseSchema = z.object({});
export type DeleteJaewonsaengResponse = z.infer<typeof DeleteJaewonsaengResponseSchema>;

export const GetJaewonsaengBoninResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  birthDate: z.string().nullable(),
  genderName: z.string(),
  genderNanoId: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  bigo: z.string().nullable(),
}).passthrough();
export type GetJaewonsaengBoninResponse = z.infer<typeof GetJaewonsaengBoninResponseSchema>;

export const UpdateJaewonsaengBoninRequestSchema = z.object({
  name: z.string().optional(),
  birthDate: z.string().nullable().optional(),
  genderNanoId: z.string().optional(),
  phoneNumber: z.string().nullable().optional(),
  emailAddress: z.string().nullable().optional(),
  bigo: z.string().nullable().optional(),
});
export type UpdateJaewonsaengBoninRequest = z.infer<typeof UpdateJaewonsaengBoninRequestSchema>;

export const UpdateJaewonsaengBoninResponseSchema = z.object({
  name: z.string(),
  birthDate: z.string().nullable(),
  genderName: z.string(),
  genderNanoId: z.string(),
  phoneNumber: z.string().nullable(),
  emailAddress: z.string().nullable(),
  bigo: z.string().nullable(),
});
export type UpdateJaewonsaengBoninResponse = z.infer<typeof UpdateJaewonsaengBoninResponseSchema>;

export const JaewonsaengBohojaSchema = z.object({
  nanoId: z.string(),
  gwangye: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  bigo: z.string().nullable(),
}).passthrough();
export type JaewonsaengBohoja = z.infer<typeof JaewonsaengBohojaSchema>;

export const GetJaewonsaengBohojasResponseSchema = z.object({
  bohojas: z.array(JaewonsaengBohojaSchema),
});
export type GetJaewonsaengBohojasResponse = z.infer<typeof GetJaewonsaengBohojasResponseSchema>;

export const CreateJaewonsaengBohojaRequestSchema = z.object({
  gwangye: z.string(),
  phoneNumber: z.string().nullable(),
  emailAddress: z.string().nullable(),
  bigo: z.string().nullable(),
});
export type CreateJaewonsaengBohojaRequest = z.infer<typeof CreateJaewonsaengBohojaRequestSchema>;

export const CreateJaewonsaengBohojaResponseSchema = z.object({
  nanoId: z.string(),
  gwangye: z.string(),
  phoneNumber: z.string().nullable(),
  emailAddress: z.string().nullable(),
  bigo: z.string().nullable(),
});
export type CreateJaewonsaengBohojaResponse = z.infer<typeof CreateJaewonsaengBohojaResponseSchema>;

export const UpdateJaewonsaengBohojaRequestSchema = z.object({
  gwangye: z.string().optional(),
  phoneNumber: z.string().nullable().optional(),
  emailAddress: z.string().nullable().optional(),
  bigo: z.string().nullable().optional(),
});
export type UpdateJaewonsaengBohojaRequest = z.infer<typeof UpdateJaewonsaengBohojaRequestSchema>;

export const UpdateJaewonsaengBohojaResponseSchema = z.object({
  nanoId: z.string(),
  gwangye: z.string(),
  phoneNumber: z.string().nullable(),
  emailAddress: z.string().nullable(),
  bigo: z.string().nullable(),
});
export type UpdateJaewonsaengBohojaResponse = z.infer<typeof UpdateJaewonsaengBohojaResponseSchema>;

export const DeleteJaewonsaengBohojaResponseSchema = z.object({});
export type DeleteJaewonsaengBohojaResponse = z.infer<typeof DeleteJaewonsaengBohojaResponseSchema>;

export const GetJaewonsaengOverallResponseSchema = z.object({
  jaewonsaengBonin: GetJaewonsaengBoninResponseSchema,
  jaewonsaengBohojas: z.array(JaewonsaengBohojaSchema),
  jaewonsaeng: z.object({
    nanoId: z.string(),
    jaewonCategorySangtaeName: z.string(),
    jaewonCategorySangtaeNanoId: z.string(),
    name: z.string(),
    nickname: z.string(),
    isHwalseong: z.boolean(),
  }),
});
export type GetJaewonsaengOverallResponse = z.infer<typeof GetJaewonsaengOverallResponseSchema>;

export const GetJaewonsaengHadaLinkCodeResponseSchema = z.object({
  linkCode: z.string().nullable(),
  issuedAt: z.string().nullable(),
  issuedByName: z.string().nullable(),
});
export type GetJaewonsaengHadaLinkCodeResponse = z.infer<
  typeof GetJaewonsaengHadaLinkCodeResponseSchema
>;

export const IssueJaewonsaengHadaLinkCodeResponseSchema = z.object({
  linkCode: z.string(),
  issuedAt: z.string(),
  issuedByName: z.string(),
});
export type IssueJaewonsaengHadaLinkCodeResponse = z.infer<
  typeof IssueJaewonsaengHadaLinkCodeResponseSchema
>;

export const IssueJaewonsaengHadaDeepLinkResponseSchema = z.object({
  deepLink: z.string().optional(),
});
export type IssueJaewonsaengHadaDeepLinkResponse = z.infer<
  typeof IssueJaewonsaengHadaDeepLinkResponseSchema
>;

export const BatchLinkJaewonsaengGroupsRequestSchema = z.object({
  jaewonsaengGroupNanoIds: z.array(z.string()),
});
export type BatchLinkJaewonsaengGroupsRequest = z.infer<
  typeof BatchLinkJaewonsaengGroupsRequestSchema
>;

export const BatchLinkJaewonsaengGroupsResponseSchema = z.object({
  jaewonsaengGroups: z.array(z.object({
    nanoId: z.string(),
    name: z.string(),
    groupTypeName: z.string(),
    groupTypeNanoId: z.string(),
    isHwalseong: z.boolean(),
  })),
});
export type BatchLinkJaewonsaengGroupsResponse = z.infer<
  typeof BatchLinkJaewonsaengGroupsResponseSchema
>;

export const UnlinkJaewonsaengHadaResponseSchema = z.object({});
export type UnlinkJaewonsaengHadaResponse = z.infer<typeof UnlinkJaewonsaengHadaResponseSchema>;

export const JaewonCategorySangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  isHwalseong: z.boolean(),
});
export type JaewonCategorySangtae = z.infer<typeof JaewonCategorySangtaeSchema>;

export const GetJaewonCategorySangtaesResponseSchema = z.object({
  sangtaes: z.array(JaewonCategorySangtaeSchema),
});
export type GetJaewonCategorySangtaesResponse = z.infer<
  typeof GetJaewonCategorySangtaesResponseSchema
>;

export const UpsertJaewonCategorySangtaesRequestSchema = z.object({
  sangtaes: z.array(
    z.object({
      nanoId: z.string().optional(),
      name: z.string(),
      isHwalseong: z.boolean(),
    }),
  ),
});
export type UpsertJaewonCategorySangtaesRequest = z.infer<
  typeof UpsertJaewonCategorySangtaesRequestSchema
>;

export const UpsertJaewonCategorySangtaesResponseSchema = z.object({});
export type UpsertJaewonCategorySangtaesResponse = z.infer<
  typeof UpsertJaewonCategorySangtaesResponseSchema
>;
