import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetSmsBalsinBunhosRequest,
  GetSmsBalsinBunhosRequestSchema,
  GetSmsBalsinBunhosResponse,
  GetSmsBalsinBunhosResponseSchema,
  GetSmsBalsinBunhoDetailRequest,
  GetSmsBalsinBunhoDetailRequestSchema,
  GetSmsBalsinBunhoDetailResponse,
  GetSmsBalsinBunhoDetailResponseSchema,
  UpdateSmsBalsinBunhoRequest,
  UpdateSmsBalsinBunhoRequestSchema,
  UpdateSmsBalsinBunhoResponse,
  UpdateSmsBalsinBunhoResponseSchema,
} from './sms-balsin-bunho.schema';

export const getSmsBalsinBunhos = async (
  params: GetSmsBalsinBunhosRequest,
): Promise<GetSmsBalsinBunhosResponse> => {
  const validated = GetSmsBalsinBunhosRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/sms-balsin-bunhos', { params: validated });
  return parseOrThrow(GetSmsBalsinBunhosResponseSchema, res.data);
};

export const useGetSmsBalsinBunhosQuery = (
  params: GetSmsBalsinBunhosRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetSmsBalsinBunhosResponse, unknown>({
    queryKey: ['smsBalsinBunhos', params],
    queryFn: () => getSmsBalsinBunhos(params),
    enabled: options?.enabled ?? true,
  });

export const getSmsBalsinBunhoDetail = async (
  nanoId: string,
  params: GetSmsBalsinBunhoDetailRequest,
): Promise<GetSmsBalsinBunhoDetailResponse> => {
  const validated = GetSmsBalsinBunhoDetailRequestSchema.parse(params);
  const res = await apiClient.get(`/T/dl/sms-balsin-bunhos/${nanoId}`, { params: validated });
  return parseOrThrow(GetSmsBalsinBunhoDetailResponseSchema, res.data);
};

export const useGetSmsBalsinBunhoDetailQuery = (
  nanoId: string,
  params: GetSmsBalsinBunhoDetailRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetSmsBalsinBunhoDetailResponse, unknown>({
    queryKey: ['smsBalsinBunho', nanoId, params],
    queryFn: () => getSmsBalsinBunhoDetail(nanoId, params),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateSmsBalsinBunho = async (
  nanoId: string,
  data: UpdateSmsBalsinBunhoRequest,
): Promise<UpdateSmsBalsinBunhoResponse> => {
  const body = UpdateSmsBalsinBunhoRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/sms-balsin-bunhos/${nanoId}`, body);
  return parseOrThrow(UpdateSmsBalsinBunhoResponseSchema, res.data);
};

export const useUpdateSmsBalsinBunhoMutation = (nanoId: string) =>
  useAuthedMutation<UpdateSmsBalsinBunhoResponse, unknown, UpdateSmsBalsinBunhoRequest>({
    mutationFn: (data) => updateSmsBalsinBunho(nanoId, data),
  });
