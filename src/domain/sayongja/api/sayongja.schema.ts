import { z } from 'zod';

const SangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  isHwalseong: z.boolean(),
});

const PermissionSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  role: z.string(),
});

export const GetSayongjasRequestSchema = z.object({
  gigwanNanoId: z.string(),
  sayongjaNameSearch: z.string().optional(),
  jojikFilters: z.array(z.string()).optional(),
  isHwalseongFilter: z.boolean().optional(),
  workTypeCustomSangtaeFilters: z.array(z.string()).optional(),
  employmentCategorySangtaeFilters: z.array(z.string()).optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
  sortByOption: z.string().optional(),
});
export type GetSayongjasRequest = z.infer<typeof GetSayongjasRequestSchema>;

export const SayongjaListItemSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  employedAt: z.string(),
  isHwalseong: z.boolean(),
});
export type SayongjaListItem = z.infer<typeof SayongjaListItemSchema>;

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

export const GetSayongjasResponseSchema = z
  .object({
    paginationData: PaginationDataSchema.optional(),
    sayongjas: z.array(SayongjaListItemSchema),
  })
  .passthrough();
export type GetSayongjasResponse = z.infer<typeof GetSayongjasResponseSchema>;

export const SayongjaDetailSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  employedAt: z.string(),
  isHwalseong: z.boolean(),
  workTypeSangtae: SangtaeSchema.nullable(),
  employmentSangtae: SangtaeSchema.nullable(),
  loginId: z.string(),
  createdAt: z.string(),
});
export type SayongjaDetail = z.infer<typeof SayongjaDetailSchema>;

export const CreateSayongjaRequestSchema = z.object({
  name: z.string(),
  gigwanNanoId: z.string(),
  employedAt: z.string(),
  isHwalseong: z.boolean(),
  employmentSangtaeNanoId: z.string().nullable(),
  workTypeSangtaeNanoId: z.string().nullable(),
  loginId: z.string(),
  password: z.string(),
});
export type CreateSayongjaRequest = z.infer<typeof CreateSayongjaRequestSchema>;

export const CreateSayongjaResponseSchema = SayongjaDetailSchema;
export type CreateSayongjaResponse = z.infer<typeof CreateSayongjaResponseSchema>;

export const GetSayongjaDetailResponseSchema = SayongjaDetailSchema;
export type GetSayongjaDetailResponse = z.infer<typeof GetSayongjaDetailResponseSchema>;

export const UpdateSayongjaRequestSchema = z.object({
  name: z.string().optional(),
  employedAt: z.string().optional(),
  employmentSangtaeNanoId: z.string().nullable().optional(),
  workTypeSangtaeNanoId: z.string().nullable().optional(),
  loginId: z.string().optional(),
  password: z.string().optional(),
  isHwalseong: z.boolean().optional(),
});
export type UpdateSayongjaRequest = z.infer<typeof UpdateSayongjaRequestSchema>;

export const UpdateSayongjaResponseSchema = SayongjaDetailSchema;
export type UpdateSayongjaResponse = z.infer<typeof UpdateSayongjaResponseSchema>;

export const DeleteSayongjaResponseSchema = z.object({});
export type DeleteSayongjaResponse = z.infer<typeof DeleteSayongjaResponseSchema>;

export const BatchlinkSayongjaPermissionsRequestSchema = z.object({
  permissions: z.array(z.string()),
});
export type BatchlinkSayongjaPermissionsRequest = z.infer<
  typeof BatchlinkSayongjaPermissionsRequestSchema
>;

export const BatchlinkSayongjaPermissionsResponseSchema = z.object({
  permissions: z.array(PermissionSchema),
});
export type BatchlinkSayongjaPermissionsResponse = z.infer<
  typeof BatchlinkSayongjaPermissionsResponseSchema
>;

export const GetSayongjaPermissionsResponseSchema = z.object({
  permissions: z.array(PermissionSchema),
});
export type GetSayongjaPermissionsResponse = z.infer<typeof GetSayongjaPermissionsResponseSchema>;

export const GetMyJojiksResponseSchema = z.object({
  jojiks: z.array(
    z.object({
      name: z.string(),
      nanoId: z.string(),
    }),
  ),
});
export type GetMyJojiksResponse = z.infer<typeof GetMyJojiksResponseSchema>;
