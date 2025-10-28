import { z } from 'zod';

const SayongjaInPermissionSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  employmentSangtae: z.string(),
  activeSangtae: z.string(),
});

export const GetPermissionSayongjasResponseSchema = z.object({
  sayongjas: z.array(SayongjaInPermissionSchema),
});
export type GetPermissionSayongjasResponse = z.infer<typeof GetPermissionSayongjasResponseSchema>;

export const PermissionListItemSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  permissionType: z.string(),
  typeId: z.number(),
});
export const GetPermissionsResponseSchema = z.object({
  permissions: z.array(PermissionListItemSchema),
});
export type GetPermissionsResponse = z.infer<typeof GetPermissionsResponseSchema>;

export const GetPermissionDetailResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  type: z.string(),
  linkJojik: z
    .object({
      name: z.string(),
      nanoId: z.string(),
    })
    .nullable(),
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
