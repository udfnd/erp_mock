import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import apiClient from '@/api';

import {
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
  UpsertJojikAddressRequestSchema,
  type UpsertJojikAddressRequest,
  UpsertJojikAddressResponseSchema,
  type UpsertJojikAddressResponse,
  UpdateJojikNameRequestSchema,
  type UpdateJojikNameRequest,
  UpdateJojikNameResponseSchema,
  type UpdateJojikNameResponse,
  UpdateJojikIntroRequestSchema,
  type UpdateJojikIntroRequest,
  UpdateJojikIntroResponseSchema,
  type UpdateJojikIntroResponse,
  UpdateJojikSchoolsRequestSchema,
  type UpdateJojikSchoolsRequest,
  UpdateJojikSchoolsResponseSchema,
  type UpdateJojikSchoolsResponse,
  UpdateJojikOpenSettingRequestSchema,
  type UpdateJojikOpenSettingRequest,
  UpdateJojikOpenSettingResponseSchema,
  type UpdateJojikOpenSettingResponse,
  UpsertJojikHomepageRequestSchema,
  type UpsertJojikHomepageRequest,
  UpsertJojikHomepageResponseSchema,
  type UpsertJojikHomepageResponse,
} from './jojik.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const getJojiks = async (): Promise<GetJojiksResponse> => {
  const res = await apiClient.get('/T/dl/jojiks');
  return parseOrThrow(GetJojiksResponseSchema, res.data);
};

export const useJojiksQuery = (options?: { enabled?: boolean }) =>
  useQuery<GetJojiksResponse, unknown>({
    queryKey: ['jojiks'],
    queryFn: getJojiks,
    enabled: options?.enabled ?? true,
  });

export const createJojik = async (data: CreateJojikRequest): Promise<CreateJojikResponse> => {
  const body = CreateJojikRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jojiks', body);
  return parseOrThrow(CreateJojikResponseSchema, res.data);
};

export const useCreateJojikMutation = () =>
  useMutation<CreateJojikResponse, unknown, CreateJojikRequest>({
    mutationFn: (d) => createJojik(d),
  });

export const getJojik = async (nanoId: string): Promise<JojikDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jojiks/${nanoId}`);
  return parseOrThrow(JojikDetailResponseSchema, res.data);
};

export const useJojikQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<JojikDetailResponse, unknown>({
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
  useMutation<UpdateJojikResponse, unknown, UpdateJojikRequest>({
    mutationFn: (d) => updateJojik(nanoId, d),
  });

export const deleteJojik = async (nanoId: string): Promise<DeleteJojikResponse> => {
  const res = await apiClient.delete(`/T/dl/jojiks/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteJojikResponseSchema, res.data);
};

export const useDeleteJojikMutation = (nanoId: string) =>
  useMutation<DeleteJojikResponse, unknown, void>({
    mutationFn: () => deleteJojik(nanoId),
  });

export const getJojikPermissions = async (nanoId: string): Promise<GetJojikPermissionsResponse> => {
  const res = await apiClient.get(`/T/feat/jojiks/${nanoId}/permissions`);
  return parseOrThrow(GetJojikPermissionsResponseSchema, res.data);
};

export const useJojikPermissionsQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetJojikPermissionsResponse, unknown>({
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
  useQuery<GetJojikSettingSidebarResponse, unknown>({
    queryKey: ['jojikSettingSidebar', nanoId],
    queryFn: () => getJojikSettingSidebar(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const upsertJojikAddress = async (
  nanoId: string,
  data: UpsertJojikAddressRequest,
): Promise<UpsertJojikAddressResponse> => {
  const body = UpsertJojikAddressRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojiks/${nanoId}/address`, body);
  return parseOrThrow(UpsertJojikAddressResponseSchema, res.data);
};

export const useUpsertJojikAddressMutation = (nanoId: string) =>
  useMutation<UpsertJojikAddressResponse, unknown, UpsertJojikAddressRequest>({
    mutationFn: (d) => upsertJojikAddress(nanoId, d),
  });

export const updateJojikName = async (
  nanoId: string,
  data: UpdateJojikNameRequest,
): Promise<UpdateJojikNameResponse> => {
  const body = UpdateJojikNameRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojiks/${nanoId}/name`, body);
  return parseOrThrow(UpdateJojikNameResponseSchema, res.data);
};

export const useUpdateJojikNameMutation = (nanoId: string) =>
  useMutation<UpdateJojikNameResponse, unknown, UpdateJojikNameRequest>({
    mutationFn: (d) => updateJojikName(nanoId, d),
  });

export const updateJojikIntro = async (
  nanoId: string,
  data: UpdateJojikIntroRequest,
): Promise<UpdateJojikIntroResponse> => {
  const body = UpdateJojikIntroRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojiks/${nanoId}/intro`, body);
  return parseOrThrow(UpdateJojikIntroResponseSchema, res.data);
};

export const useUpdateJojikIntroMutation = (nanoId: string) =>
  useMutation<UpdateJojikIntroResponse, unknown, UpdateJojikIntroRequest>({
    mutationFn: (d) => updateJojikIntro(nanoId, d),
  });

export const updateJojikSchools = async (
  nanoId: string,
  data: UpdateJojikSchoolsRequest,
): Promise<UpdateJojikSchoolsResponse> => {
  const body = UpdateJojikSchoolsRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/jojiks/${nanoId}/schools`, body);
  return parseOrThrow(UpdateJojikSchoolsResponseSchema, res.data);
};

export const useUpdateJojikSchoolsMutation = (nanoId: string) =>
  useMutation<UpdateJojikSchoolsResponse, unknown, UpdateJojikSchoolsRequest>({
    mutationFn: (d) => updateJojikSchools(nanoId, d),
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
  useMutation<UpdateJojikOpenSettingResponse, unknown, UpdateJojikOpenSettingRequest>({
    mutationFn: (d) => updateJojikOpenSetting(nanoId, d),
  });

export const upsertJojikHomepage = async (
  nanoId: string,
  data: UpsertJojikHomepageRequest,
): Promise<UpsertJojikHomepageResponse> => {
  const body = UpsertJojikHomepageRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/jojiks/${nanoId}/homepage`, body);
  return parseOrThrow(UpsertJojikHomepageResponseSchema, res.data);
};

export const useUpsertJojikHomepageMutation = (nanoId: string) =>
  useMutation<UpsertJojikHomepageResponse, unknown, UpsertJojikHomepageRequest>({
    mutationFn: (d) => upsertJojikHomepage(nanoId, d),
  });
