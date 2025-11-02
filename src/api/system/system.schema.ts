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

export const GetSayongjaSangtaesResponseSchema = z.object({
  sangtaes: z.array(SystemItemSchema),
});
export type GetSayongjaSangtaesResponse = z.infer<typeof GetSayongjaSangtaesResponseSchema>;

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
