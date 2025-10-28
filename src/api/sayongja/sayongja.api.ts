import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import apiClient from '@/api';

import {
  GetSayongjasRequest,
  GetSayongjasRequestSchema,
  GetSayongjasResponse,
  GetSayongjasResponseSchema,
  CreateSayongjaRequest,
  CreateSayongjaRequestSchema,
  CreateSayongjaResponse,
  CreateSayongjaResponseSchema,
  GetSayongjaDetailResponse,
  GetSayongjaDetailResponseSchema,
  UpdateSayongjaRequest,
  UpdateSayongjaRequestSchema,
  UpdateSayongjaResponse,
  UpdateSayongjaResponseSchema,
  DeleteSayongjaResponse,
  DeleteSayongjaResponseSchema,
  BatchlinkSayongjaPermissionsRequest,
  BatchlinkSayongjaPermissionsRequestSchema,
  BatchlinkSayongjaPermissionsResponse,
  BatchlinkSayongjaPermissionsResponseSchema,
  GetSayongjaPermissionsResponse,
  GetSayongjaPermissionsResponseSchema,
} from './sayongja.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getSayongjas = async (params: GetSayongjasRequest): Promise<GetSayongjasResponse> => {
  const validatedParams = GetSayongjasRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/sayongjas', { params: validatedParams });
  return parseOrThrow(GetSayongjasResponseSchema, res.data);
};

export const useGetSayongjasQuery = (
  params: GetSayongjasRequest,
  options?: { enabled?: boolean },
) =>
  useQuery<GetSayongjasResponse, unknown>({
    queryKey: ['sayongjas', params],
    queryFn: () => getSayongjas(params),
    enabled: options?.enabled ?? true,
  });

export const createSayongja = async (
  data: CreateSayongjaRequest,
): Promise<CreateSayongjaResponse> => {
  const body = CreateSayongjaRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/sayongjas', body);
  return parseOrThrow(CreateSayongjaResponseSchema, res.data);
};

export const useCreateSayongjaMutation = () =>
  useMutation<CreateSayongjaResponse, unknown, CreateSayongjaRequest>({
    mutationFn: createSayongja,
  });

export const getSayongjaDetail = async (nanoId: string): Promise<GetSayongjaDetailResponse> => {
  const res = await apiClient.get(`/T/dl/sayongjas/${nanoId}`);
  return parseOrThrow(GetSayongjaDetailResponseSchema, res.data);
};

export const useGetSayongjaDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetSayongjaDetailResponse, unknown>({
    queryKey: ['sayongja', nanoId],
    queryFn: () => getSayongjaDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateSayongja = async (
  nanoId: string,
  data: UpdateSayongjaRequest,
): Promise<UpdateSayongjaResponse> => {
  const body = UpdateSayongjaRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/sayongjas/${nanoId}`, body);
  return parseOrThrow(UpdateSayongjaResponseSchema, res.data);
};

export const useUpdateSayongjaMutation = (nanoId: string) =>
  useMutation<UpdateSayongjaResponse, unknown, UpdateSayongjaRequest>({
    mutationFn: (data) => updateSayongja(nanoId, data),
  });

export const deleteSayongja = async (nanoId: string): Promise<DeleteSayongjaResponse> => {
  const res = await apiClient.delete(`/T/dl/sayongjas/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteSayongjaResponseSchema, res.data);
};

export const useDeleteSayongjaMutation = (nanoId: string) =>
  useMutation<DeleteSayongjaResponse, unknown, void>({
    mutationFn: () => deleteSayongja(nanoId),
  });

export const batchlinkSayongjaPermissions = async (
  nanoId: string,
  data: BatchlinkSayongjaPermissionsRequest,
): Promise<BatchlinkSayongjaPermissionsResponse> => {
  const body = BatchlinkSayongjaPermissionsRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/sayongjas/${nanoId}/batchlink-permissions`, body);
  return parseOrThrow(BatchlinkSayongjaPermissionsResponseSchema, res.data);
};

export const useBatchlinkSayongjaPermissionsMutation = (nanoId: string) =>
  useMutation<BatchlinkSayongjaPermissionsResponse, unknown, BatchlinkSayongjaPermissionsRequest>({
    mutationFn: (data) => batchlinkSayongjaPermissions(nanoId, data),
  });

export const getSayongjaPermissions = async (
  nanoId: string,
): Promise<GetSayongjaPermissionsResponse> => {
  const res = await apiClient.get(`/T/feat/sayongjas/${nanoId}/permissions`);
  return parseOrThrow(GetSayongjaPermissionsResponseSchema, res.data);
};

export const useGetSayongjaPermissionsQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetSayongjaPermissionsResponse, unknown>({
    queryKey: ['sayongjaPermissions', nanoId],
    queryFn: () => getSayongjaPermissions(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });
