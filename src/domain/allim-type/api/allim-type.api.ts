import { apiClient } from '@/global';
import { useAuthedQuery } from '@/global/auth';

import { parseOrThrow } from '../../util';

import { GetAllimTypesResponse, GetAllimTypesResponseSchema } from './allim-type.schema';

export const getAllimTypes = async (): Promise<GetAllimTypesResponse> => {
  const res = await apiClient.get('/T/dl/allim-types');
  return parseOrThrow(GetAllimTypesResponseSchema, res.data);
};

export const useGetAllimTypesQuery = (options?: { enabled?: boolean }) =>
  useAuthedQuery<GetAllimTypesResponse, unknown>({
    queryKey: ['allimTypes'],
    queryFn: () => getAllimTypes(),
    enabled: options?.enabled ?? true,
  });
