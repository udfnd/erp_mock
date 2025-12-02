import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';
import {
  GetJojikMunuisRequestSchema,
  GetJojikMunuisResponseSchema,
  GetJojikMunuisResponse,
  GetJojikMunuisRequest,
  GetJojikMunuiDetailResponseSchema,
  GetJojikMunuiDetailResponse,
  UpdateJojikMunuiRequestSchema,
  UpdateJojikMunuiResponseSchema,
  UpdateJojikMunuiResponse,
  UpdateJojikMunuiRequest,
} from './jojik-munui.schema';

export const getJojikMunuis = async (
  params: GetJojikMunuisRequest,
): Promise<GetJojikMunuisResponse> => {
  const validated = GetJojikMunuisRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jojik-munuis', { params: validated });
  return parseOrThrow(GetJojikMunuisResponseSchema, res.data);
};

export const useGetJojikMunuisQuery = (
  params: GetJojikMunuisRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJojikMunuisResponse, unknown>({
    queryKey: ['jojikMunuis', params],
    queryFn: () => getJojikMunuis(params),
    enabled: options?.enabled ?? true,
  });

export const getJojikMunuiDetail = async (nanoId: string): Promise<GetJojikMunuiDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jojik-munuis/${nanoId}`);
  return parseOrThrow(GetJojikMunuiDetailResponseSchema, res.data);
};

export const useGetJojikMunuiDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJojikMunuiDetailResponse, unknown>({
    queryKey: ['jojikMunui', nanoId],
    queryFn: () => getJojikMunuiDetail(nanoId),
    enabled: options?.enabled ?? true,
  });

export const updateJojikMunui = async (
  nanoId: string,
  data: UpdateJojikMunuiRequest,
): Promise<UpdateJojikMunuiResponse> => {
  const validated = UpdateJojikMunuiRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojik-munuis/${nanoId}`, validated);
  return parseOrThrow(UpdateJojikMunuiResponseSchema, res.data);
};

export const useUpdateJojikMunuiMutation = () =>
  useAuthedMutation<
    UpdateJojikMunuiResponse,
    unknown,
    { nanoId: string; data: UpdateJojikMunuiRequest }
  >({
    mutationFn: (params) => updateJojikMunui(params.nanoId, params.data),
  });
