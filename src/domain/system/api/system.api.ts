import { apiClient } from '@/global';
import { useAuthedQuery } from '@/global/auth';

import { parseOrThrow } from '../../util';
import {
  GetHadaJaewonsangLinkRequestPermissionsResponse,
  GetHadaJaewonsangLinkRequestPermissionsResponseSchema,
  GetLinkIconsResponse,
  GetLinkIconsResponseSchema,
  GetOpenContentsPermissionsResponse,
  GetOpenContentsPermissionsResponseSchema,
  GetOpenSangtaesResponse,
  GetOpenSangtaesResponseSchema,
  GetPermissionTypesResponse,
  GetPermissionTypesResponseSchema,
  GetGendersResponse,
  GetGendersResponseSchema,
} from './system.schema';

export const getHadaJaewonsangLinkRequestPermissions =
  async (): Promise<GetHadaJaewonsangLinkRequestPermissionsResponse> => {
    const res = await apiClient.get('/T/dl/can-hada-link-request-sangtaes');
    return parseOrThrow(GetHadaJaewonsangLinkRequestPermissionsResponseSchema, res.data);
  };

export const useGetHadaJaewonsangLinkRequestPermissionsQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetHadaJaewonsangLinkRequestPermissionsResponse, unknown>({
    queryKey: ['hadaJaewonsangLinkRequestPermissions'],
    queryFn: getHadaJaewonsangLinkRequestPermissions,
    enabled: options?.enabled ?? true,
  });

export const getOpenContentsPermissions = async (): Promise<GetOpenContentsPermissionsResponse> => {
  const res = await apiClient.get('/T/dl/can-access-open-file-sangtaes');
  return parseOrThrow(GetOpenContentsPermissionsResponseSchema, res.data);
};

export const useGetOpenContentsPermissionsQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetOpenContentsPermissionsResponse, unknown>({
    queryKey: ['openContentsPermissions'],
    queryFn: getOpenContentsPermissions,
    enabled: options?.enabled ?? true,
  });

export const getPermissionTypes = async (): Promise<GetPermissionTypesResponse> => {
  const res = await apiClient.get('/T/dl/permission-types');
  return parseOrThrow(GetPermissionTypesResponseSchema, res.data);
};

export const useGetPermissionTypesQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetPermissionTypesResponse, unknown>({
    queryKey: ['permissionTypes'],
    queryFn: getPermissionTypes,
    enabled: options?.enabled ?? true,
  });

export const getOpenSangtaes = async (): Promise<GetOpenSangtaesResponse> => {
  const res = await apiClient.get('/T/dl/open-sangtaes');
  return parseOrThrow(GetOpenSangtaesResponseSchema, res.data);
};

export const useGetOpenSangtaesQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetOpenSangtaesResponse, unknown>({
    queryKey: ['openSangtaes'],
    queryFn: getOpenSangtaes,
    enabled: options?.enabled ?? true,
  });

export const getLinkIcons = async (): Promise<GetLinkIconsResponse> => {
  const res = await apiClient.get('/T/dl/link-icons');
  return parseOrThrow(GetLinkIconsResponseSchema, res.data);
};

export const useGetLinkIconsQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetLinkIconsResponse, unknown>({
    queryKey: ['linkIcons'],
    queryFn: getLinkIcons,
    enabled: options?.enabled ?? true,
  });

export const getGenders = async (): Promise<GetGendersResponse> => {
  const res = await apiClient.get('/T/dl/genders');
  return parseOrThrow(GetGendersResponseSchema, res.data);
};

export const useGetGendersQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetGendersResponse, unknown>({
    queryKey: ['genders'],
    queryFn: getGenders,
    enabled: options?.enabled ?? true,
  });
