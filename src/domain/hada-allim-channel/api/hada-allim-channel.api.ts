import { apiClient } from '@/global';
import { useAuthedQuery } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetHadaAllimChannelsRequest,
  GetHadaAllimChannelsRequestSchema,
  GetHadaAllimChannelsResponse,
  GetHadaAllimChannelsResponseSchema,
} from './hada-allim-channel.schema';

export const getHadaAllimChannels = async (
  params: GetHadaAllimChannelsRequest,
): Promise<GetHadaAllimChannelsResponse> => {
  const validated = GetHadaAllimChannelsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jojik-hada-allim-channels', { params: validated });
  return parseOrThrow(GetHadaAllimChannelsResponseSchema, res.data);
};

export const useGetHadaAllimChannelsQuery = (
  params: GetHadaAllimChannelsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetHadaAllimChannelsResponse, unknown>({
    queryKey: ['hadaAllimChannels', params],
    queryFn: () => getHadaAllimChannels(params),
    enabled: options?.enabled ?? true,
  });
