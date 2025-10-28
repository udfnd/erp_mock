import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import apiClient from '@/api';

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
  GetSayongjaSangtaesResponse,
  GetSayongjaSangtaesResponseSchema,
} from './system.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getHadaJaewonsangLinkRequestPermissions =
  async (): Promise<GetHadaJaewonsangLinkRequestPermissionsResponse> => {
    const res = await apiClient.get('/T/dl/hada-jaewonsang-link-request-permissions');
    return parseOrThrow(GetHadaJaewonsangLinkRequestPermissionsResponseSchema, res.data);
  };

export const useGetHadaJaewonsangLinkRequestPermissionsQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetHadaJaewonsangLinkRequestPermissionsResponse, unknown>({
    queryKey: ['hadaJaewonsangLinkRequestPermissions'],
    queryFn: getHadaJaewonsangLinkRequestPermissions,
    enabled: options?.enabled ?? true,
  });

export const getOpenContentsPermissions = async (): Promise<GetOpenContentsPermissionsResponse> => {
  const res = await apiClient.get('/T/dl/open-contents-permissions');
  return parseOrThrow(GetOpenContentsPermissionsResponseSchema, res.data);
};

export const useGetOpenContentsPermissionsQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetOpenContentsPermissionsResponse, unknown>({
    queryKey: ['openContentsPermissions'],
    queryFn: getOpenContentsPermissions,
    enabled: options?.enabled ?? true,
  });

export const getSayongjaSangtaes = async (): Promise<GetSayongjaSangtaesResponse> => {
  const res = await apiClient.get('/T/dl/sayongja-sangtaes');
  return parseOrThrow(GetSayongjaSangtaesResponseSchema, res.data);
};

export const useGetSayongjaSangtaesQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetSayongjaSangtaesResponse, unknown>({
    queryKey: ['sayongjaSangtaes'],
    queryFn: getSayongjaSangtaes,
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
