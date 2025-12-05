import { apiClient } from '@/global';
import { useAuthedQuery, useAuthedMutation } from '@/global/auth';

import { parseOrThrow } from '../../util';

import {
  GetAllimTemplatesRequest,
  GetAllimTemplatesRequestSchema,
  GetAllimTemplatesResponse,
  GetAllimTemplatesResponseSchema,
  GetAllimTemplateDetailResponse,
  GetAllimTemplateDetailResponseSchema,
  UpdateAllimTemplateRequest,
  UpdateAllimTemplateRequestSchema,
  UpdateAllimTemplateResponse,
  UpdateAllimTemplateResponseSchema,
} from './allim-template.schema';

export const getAllimTemplates = async (
  params: GetAllimTemplatesRequest,
): Promise<GetAllimTemplatesResponse> => {
  const validated = GetAllimTemplatesRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/allim-templates', { params: validated });
  return parseOrThrow(GetAllimTemplatesResponseSchema, res.data);
};

export const useGetAllimTemplatesQuery = (
  params: GetAllimTemplatesRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetAllimTemplatesResponse, unknown>({
    queryKey: ['allimTemplates', params],
    queryFn: () => getAllimTemplates(params),
    enabled: options?.enabled ?? true,
  });

export const getAllimTemplateDetail = async (
  nanoId: string,
): Promise<GetAllimTemplateDetailResponse> => {
  const res = await apiClient.get(`/T/dl/allim-templates/${nanoId}`);
  return parseOrThrow(GetAllimTemplateDetailResponseSchema, res.data);
};

export const useGetAllimTemplateDetailQuery = (nanoId: string, options?: { enabled?: boolean }) =>
  useAuthedQuery<GetAllimTemplateDetailResponse, unknown>({
    queryKey: ['allimTemplate', nanoId],
    queryFn: () => getAllimTemplateDetail(nanoId),
    enabled: !!nanoId && (options?.enabled ?? true),
  });

export const updateAllimTemplate = async (
  nanoId: string,
  data: UpdateAllimTemplateRequest,
): Promise<UpdateAllimTemplateResponse> => {
  const body = UpdateAllimTemplateRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/allim-templates/${nanoId}`, body);
  return parseOrThrow(UpdateAllimTemplateResponseSchema, res.data);
};

export const useUpdateAllimTemplateMutation = (nanoId: string) =>
  useAuthedMutation<UpdateAllimTemplateResponse, unknown, UpdateAllimTemplateRequest>({
    mutationFn: (data) => updateAllimTemplate(nanoId, data),
  });
