import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import apiClient from '@/api';

import {
  BatchlinkPermissionSayongjaRequest,
  BatchlinkPermissionSayongjaRequestSchema,
  BatchlinkPermissionSayongjaResponse,
  BatchlinkPermissionSayongjaResponseSchema,
  GetPermissionDetailResponse,
  GetPermissionDetailResponseSchema,
  GetPermissionsRequest,
  GetPermissionsRequestSchema,
  GetPermissionsResponse,
  GetPermissionsResponseSchema,
  GetPermissionSayongjasResponse,
  GetPermissionSayongjasResponseSchema,
  UpdatePermissionRequest,
  UpdatePermissionRequestSchema,
  UpdatePermissionResponse,
  UpdatePermissionResponseSchema,
} from './permission.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getPermissionSayongjas = async (
  nanoId: string,
): Promise<GetPermissionSayongjasResponse> => {
  const res = await apiClient.get(`/T/feat/permissions/${nanoId}/sayongjas`);
  return parseOrThrow(GetPermissionSayongjasResponseSchema, res.data);
};

export const useGetPermissionSayongjasQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetPermissionSayongjasResponse, unknown>({
    queryKey: ['permissionSayongjas', nanoId],
    queryFn: () => getPermissionSayongjas(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const getPermissions = async (
  params: GetPermissionsRequest,
): Promise<GetPermissionsResponse> => {
  const validated = GetPermissionsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/permissions', { params: validated });
  return parseOrThrow(GetPermissionsResponseSchema, res.data);
};

export const useGetPermissionsQuery = (
  params: GetPermissionsRequest,
  options?: { enabled?: boolean },
) =>
  useQuery<GetPermissionsResponse, unknown>({
    queryKey: ['permissions', params],
    queryFn: () => getPermissions(params),
    enabled: options?.enabled ?? true,
  });

export const getPermissionDetail = async (nanoId: string): Promise<GetPermissionDetailResponse> => {
  const res = await apiClient.get(`/T/dl/permissions/${nanoId}`);
  return parseOrThrow(GetPermissionDetailResponseSchema, res.data);
};

export const useGetPermissionDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetPermissionDetailResponse, unknown>({
    queryKey: ['permission', nanoId],
    queryFn: () => getPermissionDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updatePermission = async (
  nanoId: string,
  data: UpdatePermissionRequest,
): Promise<UpdatePermissionResponse> => {
  const body = UpdatePermissionRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/permissions/${nanoId}`, body);
  return parseOrThrow(UpdatePermissionResponseSchema, res.data);
};

export const useUpdatePermissionMutation = (nanoId: string) =>
  useMutation<UpdatePermissionResponse, unknown, UpdatePermissionRequest>({
    mutationFn: (data) => updatePermission(nanoId, data),
  });

export const batchlinkPermissionSayongja = async (
  nanoId: string,
  data: BatchlinkPermissionSayongjaRequest,
): Promise<BatchlinkPermissionSayongjaResponse> => {
  const body = BatchlinkPermissionSayongjaRequestSchema.parse(data);
  const res = await apiClient.post(
    `/T/dl/permissions/${nanoId}/batchlink-sayongjas`,
    body,
  );
  return parseOrThrow(BatchlinkPermissionSayongjaResponseSchema, res.data);
};

export const useBatchlinkPermissionSayongjaMutation = (nanoId: string) =>
  useMutation<BatchlinkPermissionSayongjaResponse, unknown, BatchlinkPermissionSayongjaRequest>({
    mutationFn: (data) => batchlinkPermissionSayongja(nanoId, data),
  });
