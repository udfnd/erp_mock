import { useMutation, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/global';

import { parseOrThrow } from '../../util';
import {
  GigwanSidebarResponse,
  GigwanSidebarResponseSchema,
  GigwanBasicGet,
  GigwanBasicGetSchema,
  UpdateGigwanRequest,
  UpdateGigwanRequestSchema,
  UpdateGigwanResponse,
  UpdateGigwanResponseSchema,
  UpsertGigwanAddressRequest,
  UpsertGigwanAddressRequestSchema,
  UpsertGigwanAddressResponse,
  UpsertGigwanAddressResponseSchema,
  UpdateGigwanIntroRequest,
  UpdateGigwanIntroRequestSchema,
  UpdateGigwanIntroResponse,
  UpdateGigwanIntroResponseSchema,
  UpdateGigwanNameRequest,
  UpdateGigwanNameRequestSchema,
  UpdateGigwanNameResponse,
  UpdateGigwanNameResponseSchema,
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
  useQuery<GigwanSidebarResponse, unknown>({
    queryKey: ['gigwanSidebar', nanoId],
    queryFn: () => getGigwanSidebar(nanoId),
    enabled: options?.enabled ?? true,
  });

export const getGigwanName = async (nanoId: string): Promise<GigwanBasicGet> => {
  const res = await apiClient.get(`/T/feat/gigwans/${nanoId}`);
  return parseOrThrow(GigwanBasicGetSchema, res.data);
};

export const useGigwanNameQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GigwanBasicGet, unknown>({
    queryKey: ['gigwanName', nanoId],
    queryFn: () => getGigwanName(nanoId),
    enabled: options?.enabled ?? true,
  });

export const getGigwan = async (nanoId: string): Promise<GigwanGet> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}`);
  return parseOrThrow(GigwanGetSchema, res.data);
};

export const useGigwanQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GigwanGet, unknown, GigwanGet, readonly ['gigwan', string]>({
    queryKey: ['gigwan', nanoId] as const,
    queryFn: () => getGigwan(nanoId),
    enabled: options?.enabled ?? true,
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
  useMutation<UpdateGigwanResponse, unknown, UpdateGigwanRequest>({
    mutationFn: (d) => updateGigwan(nanoId, d),
  });

export const upsertGigwanAddress = async (
  nanoId: string,
  data: UpsertGigwanAddressRequest,
): Promise<UpsertGigwanAddressResponse> => {
  const body = UpsertGigwanAddressRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/gigwans/${nanoId}/address`, body);
  return parseOrThrow(UpsertGigwanAddressResponseSchema, res.data);
};

export const updateGigwanIntro = async (
  nanoId: string,
  data: UpdateGigwanIntroRequest,
): Promise<UpdateGigwanIntroResponse> => {
  const body = UpdateGigwanIntroRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/gigwans/${nanoId}/intro`, body);
  return parseOrThrow(UpdateGigwanIntroResponseSchema, res.data);
};

export const updateGigwanName = async (
  nanoId: string,
  data: UpdateGigwanNameRequest,
): Promise<UpdateGigwanNameResponse> => {
  const body = UpdateGigwanNameRequestSchema.parse(data);
  const res = await apiClient.put(`/T/dl/gigwans/${nanoId}/name`, body);
  return parseOrThrow(UpdateGigwanNameResponseSchema, res.data);
};

export const useUpsertGigwanAddressMutation = (nanoId: string) =>
  useMutation<UpsertGigwanAddressResponse, unknown, UpsertGigwanAddressRequest>({
    mutationFn: (d) => upsertGigwanAddress(nanoId, d),
  });

export const useUpdateGigwanIntroMutation = (nanoId: string) =>
  useMutation<UpdateGigwanIntroResponse, unknown, UpdateGigwanIntroRequest>({
    mutationFn: (d) => updateGigwanIntro(nanoId, d),
  });

export const useUpdateGigwanNameMutation = (nanoId: string) =>
  useMutation<UpdateGigwanNameResponse, unknown, UpdateGigwanNameRequest>({
    mutationFn: (d) => updateGigwanName(nanoId, d),
  });

export const getEmploymentCategories = async (
  nanoId: string,
): Promise<GetEmploymentCategoriesResponse> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}/sayongja-employment-category`);
  return parseOrThrow(GetEmploymentCategoriesResponseSchema, res.data);
};

export const useEmploymentCategoriesQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetEmploymentCategoriesResponse, unknown>({
    queryKey: ['employmentCategories', nanoId],
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
  useMutation<UpsertEmploymentCategoriesResponse, unknown, UpsertEmploymentCategoriesRequest>({
    mutationFn: (d) => upsertEmploymentCategories(nanoId, d),
  });

export const getWorkTypeCustomSangtaes = async (
  nanoId: string,
): Promise<GetWorkTypeSangtaesResponse> => {
  const res = await apiClient.get(`/T/dl/gigwans/${nanoId}/work-type-custom-sangtaes`);
  return parseOrThrow(GetWorkTypeSangtaesResponseSchema, res.data);
};

export const useWorkTypeCustomSangtaesQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useQuery<GetWorkTypeSangtaesResponse, unknown>({
    queryKey: ['workTypeCustomSangtaes', nanoId],
    queryFn: () => getWorkTypeCustomSangtaes(nanoId),
    enabled: options?.enabled ?? true,
  });

export const upsertWorkTypeCustomSangtaes = async (
  nanoId: string,
  data: UpsertWorkTypeSangtaesRequest,
): Promise<UpsertWorkTypeSangtaesResponse> => {
  const body = UpsertWorkTypeSangtaesRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/gigwans/${nanoId}/work-type-custom-sangtaes`, body);
  return parseOrThrow(UpsertWorkTypeSangtaesResponseSchema, res.data);
};

export const useUpsertWorkTypeCustomSangtaesMutation = (nanoId: string) =>
  useMutation<UpsertWorkTypeSangtaesResponse, unknown, UpsertWorkTypeSangtaesRequest>({
    mutationFn: (d) => upsertWorkTypeCustomSangtaes(nanoId, d),
  });
