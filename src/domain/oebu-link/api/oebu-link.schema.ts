import { z } from 'zod';

const SORT_BY_OPTIONS = ['createdAtAsc', 'createdAtDesc', 'nameAsc', 'nameDesc'] as const;
export type SortByOption = (typeof SORT_BY_OPTIONS)[number];

export const GetOebuLinksRequestSchema = z.object({
  jojikNanoId: z.string(),
  nameSearch: z.string().optional(),
  pageNumber: z.number().optional(),
  pageSize: z.number().optional(),
  sortByOption: z.enum(SORT_BY_OPTIONS).optional(),
  iconFilters: z.string().optional(),
});
export type GetOebuLinksRequest = z.infer<typeof GetOebuLinksRequestSchema>;

export const PaginationDataSchema = z
  .object({
    hasNextPage: z.boolean(),
    pageItemCount: z.number(),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalItemCount: z.number(),
    totalPageCount: z.number(),
  })
  .passthrough();
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const OebuLinkListItemSchema = z.object({
  linkIcon: z.string().nullable(),
  nanoId: z.string(),
  linkUrl: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  titleName: z.string(),
  name: z.string(),
});
export type OebuLinkListItem = z.infer<typeof OebuLinkListItemSchema>;

export const GetOebuLinksResponseSchema = z
  .object({
    paginationData: PaginationDataSchema.optional(),
    oebuLinks: z.array(OebuLinkListItemSchema),
  })
  .passthrough();
export type GetOebuLinksResponse = z.infer<typeof GetOebuLinksResponseSchema>;

export const OebuLinkDetailSchema = OebuLinkListItemSchema.extend({
  updatedAt: z.string(),
  updatedBy: z.string(),
});
export type OebuLinkDetail = z.infer<typeof OebuLinkDetailSchema>;

export const CreateOebuLinkRequestSchema = z.object({
  jojikNanoId: z.string(),
  name: z.string(),
  titleName: z.string(),
  linkUrl: z.string(),
  linkIconNanoId: z.string().nullable(),
});
export type CreateOebuLinkRequest = z.infer<typeof CreateOebuLinkRequestSchema>;

export const CreateOebuLinkResponseSchema = OebuLinkDetailSchema;
export type CreateOebuLinkResponse = z.infer<typeof CreateOebuLinkResponseSchema>;

export const GetOebuLinkDetailResponseSchema = OebuLinkDetailSchema;
export type GetOebuLinkDetailResponse = z.infer<typeof GetOebuLinkDetailResponseSchema>;

export const UpdateOebuLinkRequestSchema = z.object({
  name: z.string(),
  titleName: z.string(),
  linkUrl: z.string(),
  linkIconNanoId: z.string().nullable(),
});
export type UpdateOebuLinkRequest = z.infer<typeof UpdateOebuLinkRequestSchema>;

export const UpdateOebuLinkResponseSchema = OebuLinkDetailSchema;
export type UpdateOebuLinkResponse = z.infer<typeof UpdateOebuLinkResponseSchema>;

export const DeleteOebuLinkResponseSchema = z.object({});
export type DeleteOebuLinkResponse = z.infer<typeof DeleteOebuLinkResponseSchema>;
