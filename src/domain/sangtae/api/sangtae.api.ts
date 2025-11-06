import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/global';

import { parseOrThrow } from '../../util';
import {
  NanoIdSchema,
  DeleteWorkTypeCustomSangtaeResponse,
  DeleteWorkTypeCustomSangtaeResponseSchema,
  DeleteEmploymentCategorySangtaeResponse,
  DeleteEmploymentCategorySangtaeResponseSchema,
} from './sangtae.schema';

export const deleteWorkTypeCustomSangtae = async (
  nanoId: string,
): Promise<DeleteWorkTypeCustomSangtaeResponse> => {
  const id = NanoIdSchema.parse(nanoId);
  const res = await apiClient.delete(`/T/dl/work-type-custom-sangtaes/${id}`, { data: {} });
  return parseOrThrow(DeleteWorkTypeCustomSangtaeResponseSchema, res.data);
};

export const useDeleteWorkTypeCustomSangtaeMutation = (nanoId: string) =>
  useMutation<DeleteWorkTypeCustomSangtaeResponse, unknown, void>({
    mutationFn: () => deleteWorkTypeCustomSangtae(nanoId),
  });

export const deleteEmploymentCategorySangtae = async (
  nanoId: string,
): Promise<DeleteEmploymentCategorySangtaeResponse> => {
  const id = NanoIdSchema.parse(nanoId);
  const res = await apiClient.delete(`/T/dl/employment-category-sangtae/${id}`, { data: {} });
  return parseOrThrow(DeleteEmploymentCategorySangtaeResponseSchema, res.data);
};

export const useDeleteEmploymentCategorySangtaeMutation = (nanoId: string) =>
  useMutation<DeleteEmploymentCategorySangtaeResponse, unknown, void>({
    mutationFn: () => deleteEmploymentCategorySangtae(nanoId),
  });
