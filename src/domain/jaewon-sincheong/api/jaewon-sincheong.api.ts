import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetJaewonSincheongsRequest,
  GetJaewonSincheongsRequestSchema,
  GetJaewonSincheongsResponse,
  GetJaewonSincheongsResponseSchema,
  JaewonSincheongDetailResponse,
  JaewonSincheongDetailResponseSchema,
  UpdateJaewonSincheongRequest,
  UpdateJaewonSincheongRequestSchema,
  UpdateJaewonSincheongResponse,
  UpdateJaewonSincheongResponseSchema,
  RejectJaewonSincheongResponse,
  RejectJaewonSincheongResponseSchema,
} from './jaewon-sincheong.schema';

export const getJaewonSincheongs = async (
  params: GetJaewonSincheongsRequest,
): Promise<GetJaewonSincheongsResponse> => {
  const validated = GetJaewonSincheongsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jaewon-sincheongs', { params: validated });
  return parseOrThrow(GetJaewonSincheongsResponseSchema, res.data);
};

export const useGetJaewonSincheongsQuery = (
  params: GetJaewonSincheongsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonSincheongsResponse, unknown>({
    queryKey: ['jaewon-sincheongs', params],
    queryFn: () => getJaewonSincheongs(params),
    enabled: options?.enabled ?? true,
  });

export const getJaewonSincheongDetail = async (
  nanoId: string,
): Promise<JaewonSincheongDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jaewon-sincheongs/${nanoId}`);
  return parseOrThrow(JaewonSincheongDetailResponseSchema, res.data);
};

export const useGetJaewonSincheongDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<JaewonSincheongDetailResponse, unknown>({
    queryKey: ['jaewon-sincheong', nanoId],
    queryFn: () => getJaewonSincheongDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJaewonSincheong = async (
  nanoId: string,
  data: UpdateJaewonSincheongRequest,
): Promise<UpdateJaewonSincheongResponse> => {
  const body = UpdateJaewonSincheongRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jaewon-sincheongs/${nanoId}`, body);
  return parseOrThrow(UpdateJaewonSincheongResponseSchema, res.data);
};

export const useUpdateJaewonSincheongMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJaewonSincheongResponse, unknown, UpdateJaewonSincheongRequest>({
    mutationFn: (data) => updateJaewonSincheong(nanoId, data),
  });

export const rejectJaewonSincheong = async (
  nanoId: string,
): Promise<RejectJaewonSincheongResponse> => {
  const res = await apiClient.post(`/T/dl/jaewon-sincheongs/${nanoId}/ballyeo`, {});
  return parseOrThrow(RejectJaewonSincheongResponseSchema, res.data);
};

export const useRejectJaewonSincheongMutation = (nanoId: string) =>
  useAuthedMutation<RejectJaewonSincheongResponse, unknown, void>({
    mutationFn: () => rejectJaewonSincheong(nanoId),
  });
