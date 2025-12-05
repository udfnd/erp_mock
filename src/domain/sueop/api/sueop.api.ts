import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  CreateSueopRequest,
  CreateSueopRequestSchema,
  CreateSueopResponse,
  CreateSueopResponseSchema,
  DeleteSueopResponse,
  DeleteSueopResponseSchema,
  GetSueopDetailResponse,
  GetSueopDetailResponseSchema,
  GetSueopsRequest,
  GetSueopsRequestSchema,
  GetSueopsResponse,
  GetSueopsResponseSchema,
  UpdateSueopRequest,
  UpdateSueopRequestSchema,
  UpdateSueopResponse,
  UpdateSueopResponseSchema,
} from './sueop.schema';

export const getSueops = async (params: GetSueopsRequest): Promise<GetSueopsResponse> => {
  const validated = GetSueopsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/sueops', { params: validated });
  return parseOrThrow(GetSueopsResponseSchema, res.data);
};

export const useGetSueopsQuery = (params: GetSueopsRequest, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetSueopsResponse, unknown>({
    queryKey: ['sueops', params],
    queryFn: () => getSueops(params),
    enabled: options?.enabled ?? true,
  });

export const createSueop = async (data: CreateSueopRequest): Promise<CreateSueopResponse> => {
  const body = CreateSueopRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/sueops', body);
  return parseOrThrow(CreateSueopResponseSchema, res.data);
};

export const useCreateSueopMutation = () =>
  useAuthedMutation<CreateSueopResponse, unknown, CreateSueopRequest>({
    mutationFn: createSueop,
  });

export const getSueopDetail = async (
  nanoId: string,
  jojikNanoId: string,
): Promise<GetSueopDetailResponse> => {
  const res = await apiClient.get(`/T/dl/sueops/${nanoId}`, {
    params: { jojikNanoId },
  });
  return parseOrThrow(GetSueopDetailResponseSchema, res.data);
};

export const useGetSueopDetailQuery = (
  nanoId: string,
  jojikNanoId: string,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetSueopDetailResponse, unknown>({
    queryKey: ['sueop', nanoId, jojikNanoId],
    queryFn: () => getSueopDetail(nanoId, jojikNanoId),
    enabled: !!nanoId && !!jojikNanoId && (options?.enabled ?? true),
  });

export const updateSueop = async (
  nanoId: string,
  data: UpdateSueopRequest,
): Promise<UpdateSueopResponse> => {
  const body = UpdateSueopRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/sueops/${nanoId}`, body);
  return parseOrThrow(UpdateSueopResponseSchema, res.data);
};

export const useUpdateSueopMutation = (nanoId: string) =>
  useAuthedMutation<UpdateSueopResponse, unknown, UpdateSueopRequest>({
    mutationFn: (data) => updateSueop(nanoId, data),
  });

export const deleteSueop = async (
  nanoId: string,
  jojikNanoId: string,
): Promise<DeleteSueopResponse> => {
  const res = await apiClient.delete(`/T/dl/sueops/${nanoId}`, {
    params: { jojikNanoId },
  });
  return parseOrThrow(DeleteSueopResponseSchema, res.data);
};

export const useDeleteSueopMutation = (nanoId: string, jojikNanoId: string) =>
  useAuthedMutation<DeleteSueopResponse, unknown, void>({
    mutationFn: () => deleteSueop(nanoId, jojikNanoId),
  });
