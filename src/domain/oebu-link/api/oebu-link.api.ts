import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';
import {
  CreateOebuLinkRequest,
  CreateOebuLinkRequestSchema,
  CreateOebuLinkResponse,
  CreateOebuLinkResponseSchema,
  DeleteOebuLinkResponse,
  DeleteOebuLinkResponseSchema,
  GetOebuLinkDetailResponse,
  GetOebuLinkDetailResponseSchema,
  GetOebuLinksRequest,
  GetOebuLinksRequestSchema,
  GetOebuLinksResponse,
  GetOebuLinksResponseSchema,
  UpdateOebuLinkRequest,
  UpdateOebuLinkRequestSchema,
  UpdateOebuLinkResponse,
  UpdateOebuLinkResponseSchema,
} from './oebu-link.schema';

export const getOebuLinks = async (params: GetOebuLinksRequest): Promise<GetOebuLinksResponse> => {
  const validated = GetOebuLinksRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/oebu-links', { params: validated });
  return parseOrThrow(GetOebuLinksResponseSchema, res.data);
};

export const useGetOebuLinksQuery = (
  params: GetOebuLinksRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetOebuLinksResponse, unknown>({
    queryKey: ['oebuLinks', params],
    queryFn: () => getOebuLinks(params),
    enabled: options?.enabled ?? true,
  });

export const createOebuLink = async (
  data: CreateOebuLinkRequest,
): Promise<CreateOebuLinkResponse> => {
  const body = CreateOebuLinkRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/oebu-links', body);
  return parseOrThrow(CreateOebuLinkResponseSchema, res.data);
};

export const useCreateOebuLinkMutation = () =>
  useAuthedMutation<CreateOebuLinkResponse, unknown, CreateOebuLinkRequest>({
    mutationFn: createOebuLink,
  });

export const getOebuLinkDetail = async (nanoId: string): Promise<GetOebuLinkDetailResponse> => {
  const res = await apiClient.get(`/T/dl/oebu-links/${nanoId}`);
  return parseOrThrow(GetOebuLinkDetailResponseSchema, res.data);
};

export const useGetOebuLinkDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetOebuLinkDetailResponse, unknown>({
    queryKey: ['oebuLink', nanoId],
    queryFn: () => getOebuLinkDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateOebuLink = async (
  nanoId: string,
  data: UpdateOebuLinkRequest,
): Promise<UpdateOebuLinkResponse> => {
  const body = UpdateOebuLinkRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/oebu-links/${nanoId}`, body);
  return parseOrThrow(UpdateOebuLinkResponseSchema, res.data);
};

export const useUpdateOebuLinkMutation = (nanoId: string) =>
  useAuthedMutation<UpdateOebuLinkResponse, unknown, UpdateOebuLinkRequest>({
    mutationFn: (data) => updateOebuLink(nanoId, data),
  });

export const deleteOebuLink = async (nanoId: string): Promise<DeleteOebuLinkResponse> => {
  const res = await apiClient.delete(`/T/dl/oebu-links/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteOebuLinkResponseSchema, res.data);
};

export const useDeleteOebuLinkMutation = (nanoId: string) =>
  useAuthedMutation<DeleteOebuLinkResponse, unknown, void>({
    mutationFn: () => deleteOebuLink(nanoId),
  });
