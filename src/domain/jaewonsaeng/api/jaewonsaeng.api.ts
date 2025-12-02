import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetJaewonsaengsRequest,
  GetJaewonsaengsRequestSchema,
  GetJaewonsaengsResponse,
  GetJaewonsaengsResponseSchema,
  CreateJaewonsaengRequest,
  CreateJaewonsaengRequestSchema,
  CreateJaewonsaengResponse,
  CreateJaewonsaengResponseSchema,
  GetJaewonsaengDetailResponse,
  GetJaewonsaengDetailResponseSchema,
  UpdateJaewonsaengRequest,
  UpdateJaewonsaengRequestSchema,
  UpdateJaewonsaengResponse,
  UpdateJaewonsaengResponseSchema,
  DeleteJaewonsaengResponse,
  DeleteJaewonsaengResponseSchema,
  GetJaewonsaengBoninResponse,
  GetJaewonsaengBoninResponseSchema,
  UpdateJaewonsaengBoninRequest,
  UpdateJaewonsaengBoninRequestSchema,
  UpdateJaewonsaengBoninResponse,
  UpdateJaewonsaengBoninResponseSchema,
  GetJaewonsaengBohojasResponse,
  GetJaewonsaengBohojasResponseSchema,
  CreateJaewonsaengBohojaRequest,
  CreateJaewonsaengBohojaRequestSchema,
  CreateJaewonsaengBohojaResponse,
  CreateJaewonsaengBohojaResponseSchema,
  UpdateJaewonsaengBohojaRequest,
  UpdateJaewonsaengBohojaRequestSchema,
  UpdateJaewonsaengBohojaResponse,
  UpdateJaewonsaengBohojaResponseSchema,
  DeleteJaewonsaengBohojaResponse,
  DeleteJaewonsaengBohojaResponseSchema,
  GetJaewonsaengOverallResponse,
  GetJaewonsaengOverallResponseSchema,
  GetJaewonsaengHadaLinkCodeResponse,
  GetJaewonsaengHadaLinkCodeResponseSchema,
  IssueJaewonsaengHadaLinkCodeResponse,
  IssueJaewonsaengHadaLinkCodeResponseSchema,
  IssueJaewonsaengHadaDeepLinkResponse,
  IssueJaewonsaengHadaDeepLinkResponseSchema,
  BatchLinkJaewonsaengGroupsRequest,
  BatchLinkJaewonsaengGroupsRequestSchema,
  BatchLinkJaewonsaengGroupsResponse,
  BatchLinkJaewonsaengGroupsResponseSchema,
  UnlinkJaewonsaengHadaResponse,
  UnlinkJaewonsaengHadaResponseSchema,
} from './jaewonsaeng.schema';

export const getJaewonsaengs = async (
  params: GetJaewonsaengsRequest,
): Promise<GetJaewonsaengsResponse> => {
  const validated = GetJaewonsaengsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jaewonsaengs', { params: validated });
  return parseOrThrow(GetJaewonsaengsResponseSchema, res.data);
};

export const useGetJaewonsaengsQuery = (
  params: GetJaewonsaengsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengsResponse, unknown>({
    queryKey: ['jaewonsaengs', params],
    queryFn: () => getJaewonsaengs(params),
    enabled: options?.enabled ?? true,
  });

export const createJaewonsaeng = async (
  data: CreateJaewonsaengRequest,
): Promise<CreateJaewonsaengResponse> => {
  const body = CreateJaewonsaengRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jaewonsaengs', body);
  return parseOrThrow(CreateJaewonsaengResponseSchema, res.data);
};

export const useCreateJaewonsaengMutation = () =>
  useAuthedMutation<CreateJaewonsaengResponse, unknown, CreateJaewonsaengRequest>({
    mutationFn: createJaewonsaeng,
  });

export const getJaewonsaengDetail = async (
  nanoId: string,
): Promise<GetJaewonsaengDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaengs/${nanoId}`);
  return parseOrThrow(GetJaewonsaengDetailResponseSchema, res.data);
};

export const useGetJaewonsaengDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJaewonsaengDetailResponse, unknown>({
    queryKey: ['jaewonsaeng', nanoId],
    queryFn: () => getJaewonsaengDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJaewonsaeng = async (
  nanoId: string,
  data: UpdateJaewonsaengRequest,
): Promise<UpdateJaewonsaengResponse> => {
  const body = UpdateJaewonsaengRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jaewonsaengs/${nanoId}`, body);
  return parseOrThrow(UpdateJaewonsaengResponseSchema, res.data);
};

export const useUpdateJaewonsaengMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJaewonsaengResponse, unknown, UpdateJaewonsaengRequest>({
    mutationFn: (data) => updateJaewonsaeng(nanoId, data),
  });

export const deleteJaewonsaeng = async (nanoId: string): Promise<DeleteJaewonsaengResponse> => {
  const res = await apiClient.delete(`/T/dl/jaewonsaengs/${nanoId}`, { data: {} });
  return parseOrThrow(DeleteJaewonsaengResponseSchema, res.data);
};

export const useDeleteJaewonsaengMutation = (nanoId: string) =>
  useAuthedMutation<DeleteJaewonsaengResponse, unknown, void>({
    mutationFn: () => deleteJaewonsaeng(nanoId),
  });

export const getJaewonsaengBonin = async (nanoId: string): Promise<GetJaewonsaengBoninResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaengs/${nanoId}/bonins`);
  return parseOrThrow(GetJaewonsaengBoninResponseSchema, res.data);
};

export const useGetJaewonsaengBoninQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJaewonsaengBoninResponse, unknown>({
    queryKey: ['jaewonsaengBonin', nanoId],
    queryFn: () => getJaewonsaengBonin(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateJaewonsaengBonin = async (
  nanoId: string,
  data: UpdateJaewonsaengBoninRequest,
): Promise<UpdateJaewonsaengBoninResponse> => {
  const body = UpdateJaewonsaengBoninRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jaewonsaengs/${nanoId}/bonins`, body);
  return parseOrThrow(UpdateJaewonsaengBoninResponseSchema, res.data);
};

export const useUpdateJaewonsaengBoninMutation = (nanoId: string) =>
  useAuthedMutation<UpdateJaewonsaengBoninResponse, unknown, UpdateJaewonsaengBoninRequest>({
    mutationFn: (data) => updateJaewonsaengBonin(nanoId, data),
  });

export const getJaewonsaengBohojas = async (
  nanoId: string,
): Promise<GetJaewonsaengBohojasResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaengs/${nanoId}/bohojas`);
  return parseOrThrow(GetJaewonsaengBohojasResponseSchema, res.data);
};

export const useGetJaewonsaengBohojasQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJaewonsaengBohojasResponse, unknown>({
    queryKey: ['jaewonsaengBohojas', nanoId],
    queryFn: () => getJaewonsaengBohojas(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const createJaewonsaengBohoja = async (
  nanoId: string,
  data: CreateJaewonsaengBohojaRequest,
): Promise<CreateJaewonsaengBohojaResponse> => {
  const body = CreateJaewonsaengBohojaRequestSchema.parse(data);
  const res = await apiClient.post(`/T/dl/jaewonsaengs/${nanoId}/bohojas`, body);
  return parseOrThrow(CreateJaewonsaengBohojaResponseSchema, res.data);
};

export const useCreateJaewonsaengBohojaMutation = (nanoId: string) =>
  useAuthedMutation<CreateJaewonsaengBohojaResponse, unknown, CreateJaewonsaengBohojaRequest>({
    mutationFn: (data) => createJaewonsaengBohoja(nanoId, data),
  });

export const updateJaewonsaengBohoja = async (
  bohojaId: string,
  data: UpdateJaewonsaengBohojaRequest,
): Promise<UpdateJaewonsaengBohojaResponse> => {
  const body = UpdateJaewonsaengBohojaRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jaewonsaengs/bohojas/${bohojaId}`, body);
  return parseOrThrow(UpdateJaewonsaengBohojaResponseSchema, res.data);
};

export const useUpdateJaewonsaengBohojaMutation = (bohojaId: string) =>
  useAuthedMutation<UpdateJaewonsaengBohojaResponse, unknown, UpdateJaewonsaengBohojaRequest>({
    mutationFn: (data) => updateJaewonsaengBohoja(bohojaId, data),
  });

export const deleteJaewonsaengBohoja = async (
  bohojaId: string,
): Promise<DeleteJaewonsaengBohojaResponse> => {
  const res = await apiClient.delete(`/T/dl/jaewonsaengs/bohojas/${bohojaId}`, { data: {} });
  return parseOrThrow(DeleteJaewonsaengBohojaResponseSchema, res.data);
};

export const useDeleteJaewonsaengBohojaMutation = (bohojaId: string) =>
  useAuthedMutation<DeleteJaewonsaengBohojaResponse, unknown, void>({
    mutationFn: () => deleteJaewonsaengBohoja(bohojaId),
  });

export const getJaewonsaengOverall = async (
  nanoId: string,
): Promise<GetJaewonsaengOverallResponse> => {
  const res = await apiClient.get(`/T/feat/jaewonsaengs/${nanoId}`);
  return parseOrThrow(GetJaewonsaengOverallResponseSchema, res.data);
};

export const useGetJaewonsaengOverallQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetJaewonsaengOverallResponse, unknown>({
    queryKey: ['jaewonsaengOverall', nanoId],
    queryFn: () => getJaewonsaengOverall(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const issueJaewonsaengHadaLinkCode = async (
  nanoId: string,
): Promise<IssueJaewonsaengHadaLinkCodeResponse> => {
  const res = await apiClient.post(`/T/dl/jaewonsaengs/${nanoId}/hada-link-codes`, {});
  return parseOrThrow(IssueJaewonsaengHadaLinkCodeResponseSchema, res.data);
};

export const useIssueJaewonsaengHadaLinkCodeMutation = () =>
  useAuthedMutation<IssueJaewonsaengHadaLinkCodeResponse, unknown, string>({
    mutationFn: issueJaewonsaengHadaLinkCode,
  });

export const getJaewonsaengHadaLinkCode = async (
  nanoId: string,
): Promise<GetJaewonsaengHadaLinkCodeResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaengs/${nanoId}/hada-link-codes`);
  return parseOrThrow(GetJaewonsaengHadaLinkCodeResponseSchema, res.data);
};

export const useGetJaewonsaengHadaLinkCodeQuery = (
  nanoId: string,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengHadaLinkCodeResponse, unknown>({
    queryKey: ['jaewonsaengHadaLinkCode', nanoId],
    queryFn: () => getJaewonsaengHadaLinkCode(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const issueJaewonsaengHadaDeepLink = async (
  nanoId: string,
): Promise<IssueJaewonsaengHadaDeepLinkResponse> => {
  const res = await apiClient.post(`/T/dl/jaewonsaengs/${nanoId}/hada-deep-links`, {});
  return parseOrThrow(IssueJaewonsaengHadaDeepLinkResponseSchema, res.data);
};

export const useIssueJaewonsaengHadaDeepLinkMutation = () =>
  useAuthedMutation<IssueJaewonsaengHadaDeepLinkResponse, unknown, string>({
    mutationFn: issueJaewonsaengHadaDeepLink,
  });

export const batchLinkJaewonsaengGroups = async (
  nanoId: string,
  data: BatchLinkJaewonsaengGroupsRequest,
): Promise<BatchLinkJaewonsaengGroupsResponse> => {
  const body = BatchLinkJaewonsaengGroupsRequestSchema.parse(data);
  const res = await apiClient.post(
    `/T/dl/jaewonsaengs/${nanoId}/jaewonsaeng-groups/batch-link`,
    body,
  );
  return parseOrThrow(BatchLinkJaewonsaengGroupsResponseSchema, res.data);
};

export const useBatchLinkJaewonsaengGroupsMutation = () =>
  useAuthedMutation<
    BatchLinkJaewonsaengGroupsResponse,
    unknown,
    { nanoId: string; data: BatchLinkJaewonsaengGroupsRequest }
  >({
    mutationFn: (params) => batchLinkJaewonsaengGroups(params.nanoId, params.data),
  });

export const unlinkJaewonsaengHada = async (nanoId: string): Promise<UnlinkJaewonsaengHadaResponse> => {
  const res = await apiClient.post(`/T/dl/jaewonsaeng/${nanoId}`, {});
  return parseOrThrow(UnlinkJaewonsaengHadaResponseSchema, res.data);
};

export const useUnlinkJaewonsaengHadaMutation = () =>
  useAuthedMutation<UnlinkJaewonsaengHadaResponse, unknown, string>({
    mutationFn: unlinkJaewonsaengHada,
  });
