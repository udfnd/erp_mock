import { z } from 'zod';

const SystemItemSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type SystemItem = z.infer<typeof SystemItemSchema>;

export const GetHadaJaewonsangLinkRequestPermissionsResponseSchema = z.object({
  sangtaes: z.array(SystemItemSchema),
});
export type GetHadaJaewonsangLinkRequestPermissionsResponse = z.infer<
  typeof GetHadaJaewonsangLinkRequestPermissionsResponseSchema
>;

export const GetOpenContentsPermissionsResponseSchema = z.object({
  sangtaes: z.array(SystemItemSchema),
});
export type GetOpenContentsPermissionsResponse = z.infer<
  typeof GetOpenContentsPermissionsResponseSchema
>;

export const GetPermissionTypesResponseSchema = z.object({
  permissionTypes: z.array(SystemItemSchema),
});
export type GetPermissionTypesResponse = z.infer<typeof GetPermissionTypesResponseSchema>;

export const GetOpenSangtaesResponseSchema = z.object({
  sangtaes: z.array(SystemItemSchema),
});
export type GetOpenSangtaesResponse = z.infer<typeof GetOpenSangtaesResponseSchema>;

export const GetLinkIconsResponseSchema = z.object({
  linkIcons: z.array(SystemItemSchema),
});
export type GetLinkIconsResponse = z.infer<typeof GetLinkIconsResponseSchema>;

const GenderItemSchema = z.object({
  nanoId: z.string(),
  genderName: z.string(),
});
export type GenderItem = z.infer<typeof GenderItemSchema>;

export const GetGendersResponseSchema = z.object({
  genders: z.array(GenderItemSchema),
});
export type GetGendersResponse = z.infer<typeof GetGendersResponseSchema>;

export const GetJaewonsaengGroupTypesResponseSchema = z.object({
  jaewonsaengGroupTypes: z.array(SystemItemSchema),
});
export type GetJaewonsaengGroupTypesResponse = z.infer<
  typeof GetJaewonsaengGroupTypesResponseSchema
>;
