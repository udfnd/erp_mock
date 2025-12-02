import { z } from 'zod';

// ============================================================================
// GET /T/dl/jaewonsaeng-groups - List
// ============================================================================

export const GetJaewonsaengGroupsRequestSchema = z.object({
  jojikNanoId: z.string(),
  nameSearch: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
  isHwalseongFilters: z.array(z.string()).optional(),
  groupTypeFilters: z.array(z.string()).optional(),
});
export type GetJaewonsaengGroupsRequest = z.infer<typeof GetJaewonsaengGroupsRequestSchema>;

export const JaewonsaengGroupListItemSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  groupTypeName: z.string(),
  groupTypeNanoId: z.string(),
  jaewonsaengCount: z.number(),
  isHwalseong: z.boolean(),
});
export type JaewonsaengGroupListItem = z.infer<typeof JaewonsaengGroupListItemSchema>;

export const GetJaewonsaengGroupsResponseSchema = z.object({
  jaewonsaengGroups: z.array(JaewonsaengGroupListItemSchema),
});
export type GetJaewonsaengGroupsResponse = z.infer<typeof GetJaewonsaengGroupsResponseSchema>;

// ============================================================================
// POST /T/dl/jaewonsaeng-groups - Create
// ============================================================================

export const CreateJaewonsaengGroupRequestSchema = z.object({
  jojikNanoId: z.string(),
  name: z.string(),
  jaewonsaengGroupTypeNanoId: z.string(),
});
export type CreateJaewonsaengGroupRequest = z.infer<typeof CreateJaewonsaengGroupRequestSchema>;

export const CreateJaewonsaengGroupResponseSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  groupTypeName: z.string(),
  groupTypeNanoId: z.string(),
  isHwalseong: z.boolean(),
});
export type CreateJaewonsaengGroupResponse = z.infer<typeof CreateJaewonsaengGroupResponseSchema>;

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id} - Detail
// ============================================================================

export const GetJaewonsaengGroupDetailResponseSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  groupTypeName: z.string(),
  groupTypeNanoId: z.string(),
  isHwalseong: z.boolean(),
});
export type GetJaewonsaengGroupDetailResponse = z.infer<
  typeof GetJaewonsaengGroupDetailResponseSchema
>;

// ============================================================================
// PATCH /T/dl/jaewonsaeng-groups/{nano-id} - Update
// ============================================================================

export const UpdateJaewonsaengGroupRequestSchema = z.object({
  name: z.string().optional(),
  isHwalseong: z.boolean().optional(),
});
export type UpdateJaewonsaengGroupRequest = z.infer<typeof UpdateJaewonsaengGroupRequestSchema>;

export const UpdateJaewonsaengGroupResponseSchema = GetJaewonsaengGroupDetailResponseSchema;
export type UpdateJaewonsaengGroupResponse = z.infer<typeof UpdateJaewonsaengGroupResponseSchema>;

// ============================================================================
// DELETE /T/dl/jaewonsaeng-groups/{nano-id} - Delete
// ============================================================================

export const DeleteJaewonsaengGroupResponseSchema = z.object({});
export type DeleteJaewonsaengGroupResponse = z.infer<typeof DeleteJaewonsaengGroupResponseSchema>;

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id}/jaewonsaengs - Get Members
// ============================================================================

export const GetJaewonsaengGroupMembersResponseSchema = z.object({
  jaewonsaengs: z.array(
    z.object({
      name: z.string(),
      nanoId: z.string(),
    }),
  ),
});
export type GetJaewonsaengGroupMembersResponse = z.infer<
  typeof GetJaewonsaengGroupMembersResponseSchema
>;

// ============================================================================
// GET /T/dl/jaewonsaeng-groups/{nano-id}/boksa-chamjo-groups - References
// ============================================================================

export const GetJaewonsaengGroupReferencesResponseSchema = z.object({
  jaewonsaengGroups: z.array(
    z.object({
      name: z.string(),
      nanoId: z.string(),
    }),
  ),
});
export type GetJaewonsaengGroupReferencesResponse = z.infer<
  typeof GetJaewonsaengGroupReferencesResponseSchema
>;

// ============================================================================
// POST /T/dl/jaewonsaeng-groups/{nano-id}/jaewonsaengs/batch-link - Batch Link
// ============================================================================

export const BatchLinkJaewonsaengsRequestSchema = z.object({
  jaewonsaengNanoIds: z.array(z.string()).optional(),
});
export type BatchLinkJaewonsaengsRequest = z.infer<typeof BatchLinkJaewonsaengsRequestSchema>;

export const BatchLinkJaewonsaengsResponseSchema = z.object({});
export type BatchLinkJaewonsaengsResponse = z.infer<typeof BatchLinkJaewonsaengsResponseSchema>;

// ============================================================================
// PATCH /T/feat/jaewonsaeng-groups/{groupNanoId}/jaewonsaengs/{jaewonsaengNanoId}
// ============================================================================

export const UpdateJaewonsaengGroupMemberRequestSchema = z.object({
  // Structure TBD from spec
});
export type UpdateJaewonsaengGroupMemberRequest = z.infer<
  typeof UpdateJaewonsaengGroupMemberRequestSchema
>;

export const UpdateJaewonsaengGroupMemberResponseSchema = z.object({});
export type UpdateJaewonsaengGroupMemberResponse = z.infer<
  typeof UpdateJaewonsaengGroupMemberResponseSchema
>;

// ============================================================================
// DELETE /T/feat/jaewonsaeng-groups/{groupNanoId}/jaewonsaengs/{jaewonsaengNanoId}
// ============================================================================

export const DeleteJaewonsaengGroupMemberResponseSchema = z.object({});
export type DeleteJaewonsaengGroupMemberResponse = z.infer<
  typeof DeleteJaewonsaengGroupMemberResponseSchema
>;
