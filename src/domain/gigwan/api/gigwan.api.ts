import { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';
import { gigwanQueryKeys } from './gigwan.query-keys';
import {
  GigwanSidebarResponse,
  GigwanSidebarResponseSchema,
  GigwanBasicGet,
  GigwanBasicGetSchema,
  UpdateGigwanRequest,
  UpdateGigwanRequestSchema,
  UpdateGigwanResponse,
  UpdateGigwanResponseSchema,
  GetEmploymentCategoriesResponse,
  GetEmploymentCategoriesResponseSchema,
  UpsertEmploymentCategoriesRequest,
  UpsertEmploymentCategoriesRequestSchema,
  UpsertEmploymentCategoriesResponse,
  UpsertEmploymentCategoriesResponseSchema,
  GetWorkTypeSangtaesResponse,
  GetWorkTypeSangtaesResponseSchema,
  UpsertWorkTypeSangtaesRequest,
  UpsertWorkTypeSangtaesRequestSchema,
  UpsertWorkTypeSangtaesResponse,
  UpsertWorkTypeSangtaesResponseSchema,
  GigwanGetSchema,
  GigwanGet,
} from './gigwan.schema';

export const getGigwanSidebar = async (nanoId: string): Promise<GigwanSidebarResponse> => {
  const res = await apiClient.get(`/T/feat/gigwans/${nanoId}/side-bar`);
  return parseOrThrow(GigwanSidebarResponseSchema, res.data);
};

export const useGigwanSidebarQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GigwanSidebarResponse, unknown>({
    queryKey: gigwanQueryKeys.sidebar(nanoId),
    queryFn: () => getGigwanSidebar(nanoId),
    enabled: options?.enabled ?? true,
  });

export const getGigwanName = async (nanoId: string): Promise<GigwanBasicGet> => {
  const res = await apiClient.get(`/T/feat/gigwans/${nanoId}`);
  return parseOrThrow(GigwanBasicGetSchema, res.data);
};

export const useGigwanNameQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GigwanBasicGet, unknown>({
    queryKey: gigwanQueryKeys.name(nanoId),
    queryFn: () => getGigwanName(nanoId),
    enabled: options?.enabled ?? true,
  });

export const getGigwan = async (nanoId: string): Promise<GigwanGet> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}`);
  return parseOrThrow(GigwanGetSchema, res.data);
};

export const useGigwanQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GigwanGet, unknown, ReturnType<typeof gigwanQueryKeys.detail>>({
    queryKey: gigwanQueryKeys.detail(nanoId),
    queryFn: () => getGigwan(nanoId),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
  });

export const updateGigwan = async (
  nanoId: string,
  data: UpdateGigwanRequest,
): Promise<UpdateGigwanResponse> => {
  const body = UpdateGigwanRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/gigwans/${nanoId}`, body);
  return parseOrThrow(UpdateGigwanResponseSchema, res.data);
};

export const useUpdateGigwanMutation = (nanoId: string) =>
  useAuthedMutation<UpdateGigwanResponse, unknown, UpdateGigwanRequest>({
    mutationFn: (d) => updateGigwan(nanoId, d),
  });

export const getEmploymentCategories = async (
  nanoId: string,
): Promise<GetEmploymentCategoriesResponse> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}/sayongja-employment-category`);
  return parseOrThrow(GetEmploymentCategoriesResponseSchema, res.data);
};

export const useEmploymentCategoriesQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetEmploymentCategoriesResponse, unknown>({
    queryKey: gigwanQueryKeys.employmentCategories(nanoId),
    queryFn: () => getEmploymentCategories(nanoId),
    enabled: options?.enabled ?? true,
  });

export const upsertEmploymentCategories = async (
  nanoId: string,
  data: UpsertEmploymentCategoriesRequest,
): Promise<UpsertEmploymentCategoriesResponse> => {
  const body = UpsertEmploymentCategoriesRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/gigwans/${nanoId}/employment-category-sangtae`, body);
  return parseOrThrow(UpsertEmploymentCategoriesResponseSchema, res.data);
};

export const useUpsertEmploymentCategoriesMutation = (nanoId: string) =>
  useAuthedMutation<UpsertEmploymentCategoriesResponse, unknown, UpsertEmploymentCategoriesRequest>(
    {
      mutationFn: (d) => upsertEmploymentCategories(nanoId, d),
    },
  );

export const getWorkTypeCustomSangtaes = async (
  nanoId: string,
): Promise<GetWorkTypeSangtaesResponse> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}/work-type-custom-sangtaes`, {
    headers: { 'Cache-Control': 'no-cache' },
  });
  return parseOrThrow(GetWorkTypeSangtaesResponseSchema, res.data);
};

export const useWorkTypeCustomSangtaesQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetWorkTypeSangtaesResponse, unknown>({
    queryKey: gigwanQueryKeys.workTypeCustomSangtaes(nanoId),
    queryFn: () => getWorkTypeCustomSangtaes(nanoId),
    enabled: options?.enabled ?? true,
  });

export const invalidateGigwanIdentityQueries = async (queryClient: QueryClient, nanoId: string) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: gigwanQueryKeys.detail(nanoId) }),
    queryClient.invalidateQueries({ queryKey: gigwanQueryKeys.name(nanoId) }),
    queryClient.invalidateQueries({ queryKey: gigwanQueryKeys.sidebar(nanoId) }),
  ]);

export const invalidateGigwanAllQueries = (queryClient: QueryClient, nanoId: string) =>
  queryClient.invalidateQueries({ queryKey: gigwanQueryKeys.byNanoId(nanoId) });

export const upsertWorkTypeCustomSangtaes = async (
  nanoId: string,
  data: UpsertWorkTypeSangtaesRequest,
): Promise<UpsertWorkTypeSangtaesResponse> => {
  const body = UpsertWorkTypeSangtaesRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/gigwans/${nanoId}/work-type-custom-sangtaes`, body);
  return parseOrThrow(UpsertWorkTypeSangtaesResponseSchema, res.data);
};

export const useUpsertWorkTypeCustomSangtaesMutation = (nanoId: string) =>
  useAuthedMutation<UpsertWorkTypeSangtaesResponse, unknown, UpsertWorkTypeSangtaesRequest>({
    mutationFn: (d) => upsertWorkTypeCustomSangtaes(nanoId, d),
  });
