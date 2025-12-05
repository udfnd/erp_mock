import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetEmailDomainsRequest,
  GetEmailDomainsRequestSchema,
  GetEmailDomainsResponse,
  GetEmailDomainsResponseSchema,
  GetEmailDomainDetailResponse,
  GetEmailDomainDetailResponseSchema,
  UpdateEmailDomainRequest,
  UpdateEmailDomainRequestSchema,
  UpdateEmailDomainResponse,
  UpdateEmailDomainResponseSchema,
  GetEmailDomainBalsinjasResponse,
  GetEmailDomainBalsinjasResponseSchema,
} from './email-domain.schema';

export const getEmailDomains = async (
  params: GetEmailDomainsRequest,
): Promise<GetEmailDomainsResponse> => {
  const validated = GetEmailDomainsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/email-domains', { params: validated });
  return parseOrThrow(GetEmailDomainsResponseSchema, res.data);
};

export const useGetEmailDomainsQuery = (
  params: GetEmailDomainsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetEmailDomainsResponse, unknown>({
    queryKey: ['emailDomains', params],
    queryFn: () => getEmailDomains(params),
    enabled: options?.enabled ?? true,
  });

export const getEmailDomainDetail = async (
  nanoId: string,
): Promise<GetEmailDomainDetailResponse> => {
  const res = await apiClient.get(`/T/dl/email-domains/${nanoId}`);
  return parseOrThrow(GetEmailDomainDetailResponseSchema, res.data);
};

export const useGetEmailDomainDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetEmailDomainDetailResponse, unknown>({
    queryKey: ['emailDomain', nanoId],
    queryFn: () => getEmailDomainDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateEmailDomain = async (
  nanoId: string,
  data: UpdateEmailDomainRequest,
): Promise<UpdateEmailDomainResponse> => {
  const body = UpdateEmailDomainRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/email-domains/${nanoId}`, body);
  return parseOrThrow(UpdateEmailDomainResponseSchema, res.data);
};

export const useUpdateEmailDomainMutation = (nanoId: string) =>
  useAuthedMutation<UpdateEmailDomainResponse, unknown, UpdateEmailDomainRequest>({
    mutationFn: (data) => updateEmailDomain(nanoId, data),
  });

export const getEmailDomainBalsinjas = async (
  nanoId: string,
): Promise<GetEmailDomainBalsinjasResponse> => {
  const res = await apiClient.get(`/T/dl/email-domains/${nanoId}/email-balsinjas`);
  return parseOrThrow(GetEmailDomainBalsinjasResponseSchema, res.data);
};

export const useGetEmailDomainBalsinjasQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetEmailDomainBalsinjasResponse, unknown>({
    queryKey: ['emailDomainBalsinjas', nanoId],
    queryFn: () => getEmailDomainBalsinjas(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });
