import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/global';

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
} from './system.schema';

export const getHadaJaewonsangLinkRequestPermissions =
  async (): Promise<GetHadaJaewonsangLinkRequestPermissionsResponse> => {
    const res = await apiClient.get('/T/dl/can-hada-link-request-sangtaes');
    return parseOrThrow(GetHadaJaewonsangLinkRequestPermissionsResponseSchema, res.data);
  };

export const useGetHadaJaewonsangLinkRequestPermissionsQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetHadaJaewonsangLinkRequestPermissionsResponse, unknown>({
    queryKey: ['hadaJaewonsangLinkRequestPermissions'],
    queryFn: getHadaJaewonsangLinkRequestPermissions,
    enabled: options?.enabled ?? true,
  });

export const getOpenContentsPermissions = async (): Promise<GetOpenContentsPermissionsResponse> => {
  const res = await apiClient.get('/T/dl/can-access-open-file-sangtaes');
  return parseOrThrow(GetOpenContentsPermissionsResponseSchema, res.data);
};

export const useGetOpenContentsPermissionsQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetOpenContentsPermissionsResponse, unknown>({
    queryKey: ['openContentsPermissions'],
    queryFn: getOpenContentsPermissions,
    enabled: options?.enabled ?? true,
  });

export const getPermissionTypes = async (): Promise<GetPermissionTypesResponse> => {
  const res = await apiClient.get('/T/dl/permission-types');
  return parseOrThrow(GetPermissionTypesResponseSchema, res.data);
};

export const useGetPermissionTypesQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetPermissionTypesResponse, unknown>({
    queryKey: ['permissionTypes'],
    queryFn: getPermissionTypes,
    enabled: options?.enabled ?? true,
  });

export const getOpenSangtaes = async (): Promise<GetOpenSangtaesResponse> => {
  const res = await apiClient.get('/T/dl/open-sangtaes');
  return parseOrThrow(GetOpenSangtaesResponseSchema, res.data);
};

export const useGetOpenSangtaesQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetOpenSangtaesResponse, unknown>({
    queryKey: ['openSangtaes'],
    queryFn: getOpenSangtaes,
    enabled: options?.enabled ?? true,
  });

export const getLinkIcons = async (): Promise<GetLinkIconsResponse> => {
  const res = await apiClient.get('/T/dl/link-icons');
  return parseOrThrow(GetLinkIconsResponseSchema, res.data);
};

export const useGetLinkIconsQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetLinkIconsResponse, unknown>({
    queryKey: ['linkIcons'],
    queryFn: getLinkIcons,
    enabled: options?.enabled ?? true,
  });
