import { apiClient } from '@/global';
import { useAuthedMutation, useAuthedQuery } from '@/global/auth';
import { parseOrThrow } from '../../util';
import {
  GetJaewonsaengGroupsRequestSchema,
  GetJaewonsaengGroupsResponseSchema,
  GetJaewonsaengGroupsResponse,
  GetJaewonsaengGroupsRequest,
  CreateJaewonsaengGroupRequestSchema,
  CreateJaewonsaengGroupResponseSchema,
  CreateJaewonsaengGroupResponse,
  CreateJaewonsaengGroupRequest,
  GetJaewonsaengGroupDetailResponseSchema,
  GetJaewonsaengGroupDetailResponse,
  UpdateJaewonsaengGroupRequestSchema,
  UpdateJaewonsaengGroupResponseSchema,
  UpdateJaewonsaengGroupResponse,
  UpdateJaewonsaengGroupRequest,
  DeleteJaewonsaengGroupResponseSchema,
  DeleteJaewonsaengGroupResponse,
  GetJaewonsaengGroupMembersResponseSchema,
  GetJaewonsaengGroupMembersResponse,
  GetJaewonsaengGroupReferencesResponseSchema,
  GetJaewonsaengGroupReferencesResponse,
  BatchLinkJaewonsaengsRequestSchema,
  BatchLinkJaewonsaengsResponseSchema,
  BatchLinkJaewonsaengsResponse,
  BatchLinkJaewonsaengsRequest,
  UpdateJaewonsaengGroupMemberRequestSchema,
  UpdateJaewonsaengGroupMemberResponseSchema,
  UpdateJaewonsaengGroupMemberResponse,
  UpdateJaewonsaengGroupMemberRequest,
  DeleteJaewonsaengGroupMemberResponseSchema,
  DeleteJaewonsaengGroupMemberResponse,
} from './jaewonsaengGroup.schema';

// ============================================================================
// GET /T/dl/jaewonsaeng-groups - List
// ============================================================================

export const getJaewonsaengGroups = async (
  params: GetJaewonsaengGroupsRequest,
): Promise<GetJaewonsaengGroupsResponse> => {
  const validated = GetJaewonsaengGroupsRequestSchema.parse(params);
  const res = await apiClient.get('/T/dl/jaewonsaeng-groups', { params: validated });
  return parseOrThrow(GetJaewonsaengGroupsResponseSchema, res.data);
};

export const useGetJaewonsaengGroupsQuery = (
  params: GetJaewonsaengGroupsRequest,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengGroupsResponse, unknown>({
    queryKey: ['jaewonsaengGroups', params],
    queryFn: () => getJaewonsaengGroups(params),
    enabled: options?.enabled ?? true,
  });

// ============================================================================
// POST /T/dl/jaewonsaeng-groups - Create
// ============================================================================

export const createJaewonsaengGroup = async (
  data: CreateJaewonsaengGroupRequest,
): Promise<CreateJaewonsaengGroupResponse> => {
  const validated = CreateJaewonsaengGroupRequestSchema.parse(data);
  const res = await apiClient.post('/T/dl/jaewonsaeng-groups', validated);
  return parseOrThrow(CreateJaewonsaengGroupResponseSchema, res.data);
};

export const useCreateJaewonsaengGroupMutation = () =>
  useAuthedMutation<CreateJaewonsaengGroupResponse, unknown, CreateJaewonsaengGroupRequest>({
    mutationFn: createJaewonsaengGroup,
  });

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id} - Detail
// ============================================================================

export const getJaewonsaengGroupDetail = async (
  nanoId: string,
): Promise<GetJaewonsaengGroupDetailResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaeng-groups/${nanoId}`);
  return parseOrThrow(GetJaewonsaengGroupDetailResponseSchema, res.data);
};

export const useGetJaewonsaengGroupDetailQuery = (
  nanoId: string,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengGroupDetailResponse, unknown>({
    queryKey: ['jaewonsaengGroup', nanoId],
    queryFn: () => getJaewonsaengGroupDetail(nanoId),
    enabled: options?.enabled ?? true,
  });

// ============================================================================
// PATCH /T/dl/jaewonsaeng-groups/{nano-id} - Update
// ============================================================================

export const updateJaewonsaengGroup = async (
  nanoId: string,
  data: UpdateJaewonsaengGroupRequest,
): Promise<UpdateJaewonsaengGroupResponse> => {
  const validated = UpdateJaewonsaengGroupRequestSchema.parse(data);
  const res = await apiClient.patch(`/T/dl/jaewonsaeng-groups/${nanoId}`, validated);
  return parseOrThrow(UpdateJaewonsaengGroupResponseSchema, res.data);
};

export const useUpdateJaewonsaengGroupMutation = () =>
  useAuthedMutation<
    UpdateJaewonsaengGroupResponse,
    unknown,
    { nanoId: string; data: UpdateJaewonsaengGroupRequest }
  >({
    mutationFn: (params: { nanoId: string; data: UpdateJaewonsaengGroupRequest }) =>
      updateJaewonsaengGroup(params.nanoId, params.data),
  });

// ============================================================================
// DELETE /T/dl/jaewonsaeng-groups/{nano-id} - Delete
// ============================================================================

export const deleteJaewonsaengGroup = async (nanoId: string): Promise<DeleteJaewonsaengGroupResponse> => {
  const res = await apiClient.delete(`/T/dl/jaewonsaeng-groups/${nanoId}`);
  return parseOrThrow(DeleteJaewonsaengGroupResponseSchema, res.data);
};

export const useDeleteJaewonsaengGroupMutation = () =>
  useAuthedMutation<DeleteJaewonsaengGroupResponse, unknown, string>({
    mutationFn: deleteJaewonsaengGroup,
  });

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id}/jaewonsaengs - Get Members
// ============================================================================

export const getJaewonsaengGroupMembers = async (
  nanoId: string,
): Promise<GetJaewonsaengGroupMembersResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaeng-groups/${nanoId}/jaewonsaengs`);
  return parseOrThrow(GetJaewonsaengGroupMembersResponseSchema, res.data);
};

export const useGetJaewonsaengGroupMembersQuery = (
  nanoId: string,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengGroupMembersResponse, unknown>({
    queryKey: ['jaewonsaengGroupMembers', nanoId],
    queryFn: () => getJaewonsaengGroupMembers(nanoId),
    enabled: options?.enabled ?? true,
  });

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id}/boksa-chamjo-groups - References
// ============================================================================

export const getJaewonsaengGroupReferences = async (
  nanoId: string,
): Promise<GetJaewonsaengGroupReferencesResponse> => {
  const res = await apiClient.get(`/T/dl/jaewonsaeng-groups/${nanoId}/boksa-chamjo-groups`);
  return parseOrThrow(GetJaewonsaengGroupReferencesResponseSchema, res.data);
};

export const useGetJaewonsaengGroupReferencesQuery = (
  nanoId: string,
  options?: { enabled?: boolean },
) =>
  useAuthedQuery<GetJaewonsaengGroupReferencesResponse, unknown>({
    queryKey: ['jaewonsaengGroupReferences', nanoId],
    queryFn: () => getJaewonsaengGroupReferences(nanoId),
    enabled: options?.enabled ?? true,
  });

// ============================================================================
// POST /T/dl/jaewonsaeng-groups/{nano-id}/jaewonsaengs/batch-link - Batch Link
// ============================================================================

export const batchLinkJaewonsaengs = async (
  nanoId: string,
  data: BatchLinkJaewonsaengsRequest,
): Promise<BatchLinkJaewonsaengsResponse> => {
  const validated = BatchLinkJaewonsaengsRequestSchema.parse(data);
  const res = await apiClient.post(
    `/T/dl/jaewonsaeng-groups/${nanoId}/jaewonsaengs/batch-link`,
    validated,
  );
  return parseOrThrow(BatchLinkJaewonsaengsResponseSchema, res.data);
};

export const useBatchLinkJaewonsaengsMutation = () =>
  useAuthedMutation<
    BatchLinkJaewonsaengsResponse,
    unknown,
    { nanoId: string; data: BatchLinkJaewonsaengsRequest }
  >({
    mutationFn: (params: { nanoId: string; data: BatchLinkJaewonsaengsRequest }) =>
      batchLinkJaewonsaengs(params.nanoId, params.data),
  });

// ============================================================================
// PATCH /T/feat/jaewonsaeng-groups/{groupNanoId}/jaewonsaengs/{jaewonsaengNanoId}
// ============================================================================

export const updateJaewonsaengGroupMember = async (
  groupNanoId: string,
  jaewonsaengNanoId: string,
  data: UpdateJaewonsaengGroupMemberRequest,
): Promise<UpdateJaewonsaengGroupMemberResponse> => {
  const validated = UpdateJaewonsaengGroupMemberRequestSchema.parse(data);
  const res = await apiClient.patch(
    `/T/feat/jaewonsaeng-groups/${groupNanoId}/jaewonsaengs/${jaewonsaengNanoId}`,
    validated,
  );
  return parseOrThrow(UpdateJaewonsaengGroupMemberResponseSchema, res.data);
};

export const useUpdateJaewonsaengGroupMemberMutation = () =>
  useAuthedMutation<
    UpdateJaewonsaengGroupMemberResponse,
    unknown,
    { groupNanoId: string; jaewonsaengNanoId: string; data: UpdateJaewonsaengGroupMemberRequest }
  >({
    mutationFn: (params: {
      groupNanoId: string;
      jaewonsaengNanoId: string;
      data: UpdateJaewonsaengGroupMemberRequest;
    }) =>
      updateJaewonsaengGroupMember(params.groupNanoId, params.jaewonsaengNanoId, params.data),
  });

// ============================================================================
// DELETE /T/feat/jaewonsaeng-groups/{groupNanoId}/jaewonsaengs/{jaewonsaengNanoId}
// ============================================================================

export const deleteJaewonsaengGroupMember = async (
  groupNanoId: string,
  jaewonsaengNanoId: string,
): Promise<DeleteJaewonsaengGroupMemberResponse> => {
  const res = await apiClient.delete(
    `/T/feat/jaewonsaeng-groups/${groupNanoId}/jaewonsaengs/${jaewonsaengNanoId}`,
  );
  return parseOrThrow(DeleteJaewonsaengGroupMemberResponseSchema, res.data);
};

export const useDeleteJaewonsaengGroupMemberMutation = () =>
  useAuthedMutation<
    DeleteJaewonsaengGroupMemberResponse,
    unknown,
    { groupNanoId: string; jaewonsaengNanoId: string }
  >({
    mutationFn: (params: { groupNanoId: string; jaewonsaengNanoId: string }) =>
      deleteJaewonsaengGroupMember(params.groupNanoId, params.jaewonsaengNanoId),
  });
