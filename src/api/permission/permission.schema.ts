import { z } from 'zod';

const EmploymentSangtaeSchema = z
  .object({
    nanoId: z.string(),
    name: z.string(),
  })
  .nullable();

const SayongjaInPermissionSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  employmentSangtae: EmploymentSangtaeSchema,
  isHwalseong: z.boolean(),
});

export const GetPermissionSayongjasResponseSchema = z.object({
  sayongjas: z.array(SayongjaInPermissionSchema),
});
export type GetPermissionSayongjasResponse = z.infer<typeof GetPermissionSayongjasResponseSchema>;

export const GigwanSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type Gigwan = z.infer<typeof GigwanSchema>;

export const JojikSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type Jojik = z.infer<typeof JojikSchema>;

export const TypeSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type Type = z.infer<typeof TypeSchema>;

export const PermissionSchema = z.object({
  gigwan: GigwanSchema,
  jojik: JojikSchema.nullable(),
  name: z.string(),
  nanoId: z.string(),
  type: TypeSchema,
});
export type Permission = z.infer<typeof PermissionSchema>;

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

export const GetPermissionsRequestSchema = z.object({
  gigwanNanoId: z.string(),
  permissionNameSearch: z.string().optional(),
  permissionTypeFilters: z.array(z.string()).optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
  sortByOption: z.string().optional(),
});
export type GetPermissionsRequest = z.infer<typeof GetPermissionsRequestSchema>;

export const GetPermissionsResponseSchema = z
  .object({
    paginationData: PaginationDataSchema.optional(),
    permissions: z.array(PermissionSchema),
  })
  .passthrough();
export type GetPermissionsResponse = z.infer<typeof GetPermissionsResponseSchema>;

export const GetPermissionDetailResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  type: TypeSchema,
  linkJojik: JojikSchema.nullable(),
});
export type GetPermissionDetailResponse = z.infer<typeof GetPermissionDetailResponseSchema>;

export const UpdatePermissionRequestSchema = z.object({
  name: z.string(),
});
export type UpdatePermissionRequest = z.infer<typeof UpdatePermissionRequestSchema>;

export const UpdatePermissionResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type UpdatePermissionResponse = z.infer<typeof UpdatePermissionResponseSchema>;

export const BatchlinkPermissionSayongjaRequestSchema = z.object({
  sayongjas: z.array(
    z.object({
      nanoId: z.string(),
    }),
  ),
});
export type BatchlinkPermissionSayongjaRequest = z.infer<
  typeof BatchlinkPermissionSayongjaRequestSchema
>;

export const BatchlinkPermissionSayongjaResponseSchema = z.object({
  sayongjas: z.array(SayongjaInPermissionSchema),
});
export type BatchlinkPermissionSayongjaResponse = z.infer<
  typeof BatchlinkPermissionSayongjaResponseSchema
>;
