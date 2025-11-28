import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation, type UseAuthedQueryOptions } from '@/global/auth';

import { parseOrThrow } from '../../util';
import {
  GetJojiksRequestSchema,
  type GetJojiksRequest,
  GetJojiksResponseSchema,
  type GetJojiksResponse,
  CreateJojikRequestSchema,
  type CreateJojikRequest,
  CreateJojikResponseSchema,
  type CreateJojikResponse,
  JojikDetailResponseSchema,
  type JojikDetailResponse,
  UpdateJojikRequestSchema,
  type UpdateJojikRequest,
  UpdateJojikResponseSchema,
  type UpdateJojikResponse,
  DeleteJojikResponseSchema,
  type DeleteJojikResponse,
  GetJojikPermissionsResponseSchema,
  type GetJojikPermissionsResponse,
  GetJojikSettingSidebarResponseSchema,
  type GetJojikSettingSidebarResponse,
  UpdateJojikOpenSettingRequestSchema,
  type UpdateJojikOpenSettingRequest,
  UpdateJojikOpenSettingResponseSchema,
  type UpdateJojikOpenSettingResponse,
} from './jojik.schema';

export const getJojiks = async (params: GetJojiksRequest): Promise<GetJojiksResponse> => {
  const validated = GetJojiksRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jojiks', { params: validated });
  return parseOrThrow(GetJojiksResponseSchema, res.data);
};

export const useJojiksQuery = (params: GetJojiksRequest, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJojiksResponse, unknown>({
    queryKey: ['jojiks', params],
    queryFn: () => getJojiks(params),
    enabled: options?.enabled ?? true,
  });

export const createJojik = async (data: CreateJojikRequest): Promise<CreateJojikResponse> => {
  const body = CreateJojikRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojiks', body);
  return parseOrThrow(CreateJojikResponseSchema, res.data);
};

export const useCreateJojikMutation = () =>
  useAuthedMutation<CreateJojikResponse, unknown, CreateJojikRequest>({
    mutationFn: (d) => createJojik(d),
  });

export const getJojik = async (nanoId: string): Promise<JojikDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jojiks/${nanoId}`);
  return parseOrThrow(JojikDetailResponseSchema, res.data);
};

type UseJojikQueryOptions = Omit<
  UseAuthedQueryOptions<JojikDetailResponse, unknown, ['jojik', string]>,
  'queryKey' | 'queryFn'
>;

export const useJojikQuery = (nanoId: string, options?: UseJojikQueryOptions) =>
  useAuthedQuery<JojikDetailResponse, unknown, ['jojik', string]>({
    ...options,
    queryKey: ['jojik', nanoId],
    queryFn: () => getJojik(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJojik = async (
  nanoId: string,
  data: UpdateJojikRequest,
): Promise<UpdateJojikResponse> => {
  const body = UpdateJojikRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jojiks/${nanoId}`, body);
  return parseOrThrow(UpdateJojikResponseSchema, res.data);
};

export const useUpdateJojikMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJojikResponse, unknown, UpdateJojikRequest>({
    mutationFn: (d) => updateJojik(nanoId, d),
  });

export const deleteJojik = async (nanoId: string): Promise<DeleteJojikResponse> => {
  const res = await apiClient.delete(`/T/dl/jojiks/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteJojikResponseSchema, res.data);
};

export const useDeleteJojikMutation = (nanoId: string) =>
  useAuthedMutation<DeleteJojikResponse, unknown, void>({
    mutationFn: () => deleteJojik(nanoId),
  });

export const getJojikPermissions = async (nanoId: string): Promise<GetJojikPermissionsResponse> => {
  const res = await apiClient.get(`/T/feat/jojiks/${nanoId}/permissions`);
  return parseOrThrow(GetJojikPermissionsResponseSchema, res.data);
};

export const useJojikPermissionsQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJojikPermissionsResponse, unknown>({
    queryKey: ['jojikPermissions', nanoId],
    queryFn: () => getJojikPermissions(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const getJojikSettingSidebar = async (
  nanoId: string,
): Promise<GetJojikSettingSidebarResponse> => {
  const res = await apiClient.get(`/T/feat/jojiks/${nanoId}/setting/sidebar`);
  return parseOrThrow(GetJojikSettingSidebarResponseSchema, res.data);
};

export const useJojikSettingSidebarQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJojikSettingSidebarResponse, unknown>({
    queryKey: ['jojikSettingSidebar', nanoId],
    queryFn: () => getJojikSettingSidebar(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJojikOpenSetting = async (
  nanoId: string,
  data: UpdateJojikOpenSettingRequest,
): Promise<UpdateJojikOpenSettingResponse> => {
  const body = UpdateJojikOpenSettingRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojiks/${nanoId}/open-setting`, body);
  return parseOrThrow(UpdateJojikOpenSettingResponseSchema, res.data);
};

export const useUpdateJojikOpenSettingMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJojikOpenSettingResponse, unknown, UpdateJojikOpenSettingRequest>({
    mutationFn: (d) => updateJojikOpenSetting(nanoId, d),
  });
