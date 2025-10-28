import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import apiClient from '@/api';

import {
  CreateJusoRequest,
  CreateJusoRequestSchema,
  CreateJusoResponse,
  CreateJusoResponseSchema,
  DeleteJusoResponse,
  DeleteJusoResponseSchema,
  GetJusoDetailResponse,
  GetJusoDetailResponseSchema,
  GetJusosResponse,
  GetJusosResponseSchema,
  UpdateJusoRequest,
  UpdateJusoRequestSchema,
  UpdateJusoResponse,
  UpdateJusoResponseSchema,
} from './juso.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getJusos = async (): Promise<GetJusosResponse> => {
  const res = await apiClient.get('/T/dl/jusos');
  return parseOrThrow(GetJusosResponseSchema, res.data);
};

export const useGetJusosQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetJusosResponse, unknown>({
    queryKey: ['jusos'],
    queryFn: getJusos,
    enabled: options?.enabled ?? true,
  });

export const createJuso = async (data: CreateJusoRequest): Promise<CreateJusoResponse> => {
  const body = CreateJusoRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jusos', body);
  return parseOrThrow(CreateJusoResponseSchema, res.data);
};

export const useCreateJusoMutation = () =>
  useMutation<CreateJusoResponse, unknown, CreateJusoRequest>({
    mutationFn: createJuso,
  });

export const getJusoDetail = async (nanoId: string): Promise<GetJusoDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jusos/${nanoId}`);
  return parseOrThrow(GetJusoDetailResponseSchema, res.data);
};

export const useGetJusoDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetJusoDetailResponse, unknown>({
    queryKey: ['juso', nanoId],
    queryFn: () => getJusoDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJuso = async (
  nanoId: string,
  data: UpdateJusoRequest,
): Promise<UpdateJusoResponse> => {
  const body = UpdateJusoRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jusos/${nanoId}`, body);
  return parseOrThrow(UpdateJusoResponseSchema, res.data);
};

export const useUpdateJusoMutation = (nanoId: string) =>
  useMutation<UpdateJusoResponse, unknown, UpdateJusoRequest>({
    mutationFn: (data) => updateJuso(nanoId, data),
  });

export const deleteJuso = async (nanoId: string): Promise<DeleteJusoResponse> => {
  const res = await apiClient.delete(`/T/dl/jusos/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteJusoResponseSchema, res.data);
};

export const useDeleteJusoMutation = (nanoId: string) =>
  useMutation<DeleteJusoResponse, unknown, void>({
    mutationFn: () => deleteJuso(nanoId),
  });
