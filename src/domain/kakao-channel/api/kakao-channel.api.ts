import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetKakaoChannelsRequest,
  GetKakaoChannelsRequestSchema,
  GetKakaoChannelsResponse,
  GetKakaoChannelsResponseSchema,
  GetKakaoChannelDetailRequest,
  GetKakaoChannelDetailRequestSchema,
  GetKakaoChannelDetailResponse,
  GetKakaoChannelDetailResponseSchema,
  UpdateKakaoChannelRequest,
  UpdateKakaoChannelRequestSchema,
  UpdateKakaoChannelResponse,
  UpdateKakaoChannelResponseSchema,
} from './kakao-channel.schema';

export const getKakaoChannels = async (
  params: GetKakaoChannelsRequest,
): Promise<GetKakaoChannelsResponse> => {
  const validated = GetKakaoChannelsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/kakao-channels', { params: validated });
  return parseOrThrow(GetKakaoChannelsResponseSchema, res.data);
};

export const useGetKakaoChannelsQuery = (
  params: GetKakaoChannelsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetKakaoChannelsResponse, unknown>({
    queryKey: ['kakoChannels', params],
    queryFn: () => getKakaoChannels(params),
    enabled: options?.enabled ?? true,
  });

export const getKakaoChannelDetail = async (
  nanoId: string,
  params: GetKakaoChannelDetailRequest,
): Promise<GetKakaoChannelDetailResponse> => {
  const validated = GetKakaoChannelDetailRequestSchema.parse(params);
  const res = await apiClient.get(`/T/dl/kakao-channels/${nanoId}`, { params: validated });
  return parseOrThrow(GetKakaoChannelDetailResponseSchema, res.data);
};

export const useGetKakaoChannelDetailQuery = (
  nanoId: string,
  params: GetKakaoChannelDetailRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetKakaoChannelDetailResponse, unknown>({
    queryKey: ['kakoChannel', nanoId, params],
    queryFn: () => getKakaoChannelDetail(nanoId, params),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateKakaoChannel = async (
  nanoId: string,
  data: UpdateKakaoChannelRequest,
): Promise<UpdateKakaoChannelResponse> => {
  const body = UpdateKakaoChannelRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/kakao-channels/${nanoId}`, body);
  return parseOrThrow(UpdateKakaoChannelResponseSchema, res.data);
};

export const useUpdateKakaoChannelMutation = (nanoId: string) =>
  useAuthedMutation<UpdateKakaoChannelResponse, unknown, UpdateKakaoChannelRequest>({
    mutationFn: (data) => updateKakaoChannel(nanoId, data),
  });
