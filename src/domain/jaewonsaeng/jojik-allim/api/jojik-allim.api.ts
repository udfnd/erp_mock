import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../../util';

import {
  GetJojikAllimsRequest,
  GetJojikAllimsRequestSchema,
  GetJojikAllimsResponse,
  GetJojikAllimsResponseSchema,
  CreateJojikAllimRequest,
  CreateJojikAllimRequestSchema,
  CreateJojikAllimResponse,
  CreateJojikAllimResponseSchema,
  CreateJojikTemplateAllimRequest,
  CreateJojikTemplateAllimRequestSchema,
  CreateJojikTemplateAllimResponse,
  CreateJojikTemplateAllimResponseSchema,
  CreateJojikBejaewonsaengAllimRequest,
  CreateJojikBejaewonsaengAllimRequestSchema,
  CreateJojikBejaewonsaengAllimResponse,
  CreateJojikBejaewonsaengAllimResponseSchema,
  CreateJojikBejaewonsaengTemplateAllimRequest,
  CreateJojikBejaewonsaengTemplateAllimRequestSchema,
  CreateJojikBejaewonsaengTemplateAllimResponse,
  CreateJojikBejaewonsaengTemplateAllimResponseSchema,
  GetJojikAllimDetailResponse,
  GetJojikAllimDetailResponseSchema,
  UpdateJojikAllimRequest,
  UpdateJojikAllimRequestSchema,
  UpdateJojikAllimResponse,
  UpdateJojikAllimResponseSchema,
} from './jojik-allim.schema';

export const getJojikAllims = async (
  params: GetJojikAllimsRequest,
): Promise<GetJojikAllimsResponse> => {
  const validated = GetJojikAllimsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jojik-allims', { params: validated });
  return parseOrThrow(GetJojikAllimsResponseSchema, res.data);
};

export const useGetJojikAllimsQuery = (
  params: GetJojikAllimsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJojikAllimsResponse, unknown>({
    queryKey: ['jojik-allims', params],
    queryFn: () => getJojikAllims(params),
    enabled: options?.enabled ?? true,
  });

export const createJojikAllim = async (
  data: CreateJojikAllimRequest,
): Promise<CreateJojikAllimResponse> => {
  const body = CreateJojikAllimRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojik-allims', body);
  return parseOrThrow(CreateJojikAllimResponseSchema, res.data);
};

export const useCreateJojikAllimMutation = () =>
  useAuthedMutation<CreateJojikAllimResponse, unknown, CreateJojikAllimRequest>({
    mutationFn: createJojikAllim,
  });

export const createJojikTemplateAllim = async (
  data: CreateJojikTemplateAllimRequest,
): Promise<CreateJojikTemplateAllimResponse> => {
  const body = CreateJojikTemplateAllimRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojik-allims/template-allims', body);
  return parseOrThrow(CreateJojikTemplateAllimResponseSchema, res.data);
};

export const useCreateJojikTemplateAllimMutation = () =>
  useAuthedMutation<CreateJojikTemplateAllimResponse, unknown, CreateJojikTemplateAllimRequest>({
    mutationFn: createJojikTemplateAllim,
  });

export const createJojikBejaewonsaengAllim = async (
  data: CreateJojikBejaewonsaengAllimRequest,
): Promise<CreateJojikBejaewonsaengAllimResponse> => {
  const body = CreateJojikBejaewonsaengAllimRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojik-allims/bejaewonsaeng', body);
  return parseOrThrow(CreateJojikBejaewonsaengAllimResponseSchema, res.data);
};

export const useCreateJojikBejaewonsaengAllimMutation = () =>
  useAuthedMutation<
    CreateJojikBejaewonsaengAllimResponse,
    unknown,
    CreateJojikBejaewonsaengAllimRequest
  >({
    mutationFn: createJojikBejaewonsaengAllim,
  });

export const createJojikBejaewonsaengTemplateAllim = async (
  data: CreateJojikBejaewonsaengTemplateAllimRequest,
): Promise<CreateJojikBejaewonsaengTemplateAllimResponse> => {
  const body = CreateJojikBejaewonsaengTemplateAllimRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojik-allims/bejaewonsaeng/template-allims', body);
  return parseOrThrow(CreateJojikBejaewonsaengTemplateAllimResponseSchema, res.data);
};

export const useCreateJojikBejaewonsaengTemplateAllimMutation = () =>
  useAuthedMutation<
    CreateJojikBejaewonsaengTemplateAllimResponse,
    unknown,
    CreateJojikBejaewonsaengTemplateAllimRequest
  >({
    mutationFn: createJojikBejaewonsaengTemplateAllim,
  });

export const getJojikAllimDetail = async (nanoId: string): Promise<GetJojikAllimDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jojik-allims/${nanoId}`);
  return parseOrThrow(GetJojikAllimDetailResponseSchema, res.data);
};

export const useGetJojikAllimDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJojikAllimDetailResponse, unknown>({
    queryKey: ['jojik-allim', nanoId],
    queryFn: () => getJojikAllimDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJojikAllim = async (
  nanoId: string,
  data: UpdateJojikAllimRequest,
): Promise<UpdateJojikAllimResponse> => {
  const body = UpdateJojikAllimRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jojik-allims/${nanoId}`, body);
  return parseOrThrow(UpdateJojikAllimResponseSchema, res.data);
};

export const useUpdateJojikAllimMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJojikAllimResponse, unknown, UpdateJojikAllimRequest>({
    mutationFn: (data) => updateJojikAllim(nanoId, data),
  });
