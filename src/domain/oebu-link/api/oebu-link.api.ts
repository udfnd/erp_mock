import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/common';

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

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getOebuLinks = async (params: GetOebuLinksRequest): Promise<GetOebuLinksResponse> => {
  const validated = GetOebuLinksRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/oebu-links', { params: validated });
  return parseOrThrow(GetOebuLinksResponseSchema, res.data);
};

export const useGetOebuLinksQuery = (
  params: GetOebuLinksRequest,
  options?: { enabled?: boolean },
) =>
  useQuery<GetOebuLinksResponse, unknown>({
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
  useMutation<CreateOebuLinkResponse, unknown, CreateOebuLinkRequest>({
    mutationFn: createOebuLink,
  });

export const getOebuLinkDetail = async (nanoId: string): Promise<GetOebuLinkDetailResponse> => {
  const res = await apiClient.get(`/T/dl/oebu-links/${nanoId}`);
  return parseOrThrow(GetOebuLinkDetailResponseSchema, res.data);
};

export const useGetOebuLinkDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetOebuLinkDetailResponse, unknown>({
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
  useMutation<UpdateOebuLinkResponse, unknown, UpdateOebuLinkRequest>({
    mutationFn: (data) => updateOebuLink(nanoId, data),
  });

export const deleteOebuLink = async (nanoId: string): Promise<DeleteOebuLinkResponse> => {
  const res = await apiClient.delete(`/T/dl/oebu-links/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteOebuLinkResponseSchema, res.data);
};

export const useDeleteOebuLinkMutation = (nanoId: string) =>
  useMutation<DeleteOebuLinkResponse, unknown, void>({
    mutationFn: () => deleteOebuLink(nanoId),
  });
