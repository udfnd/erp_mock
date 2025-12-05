import { z } from 'zod';

export const GetEmailDomainsRequestSchema = z.object({
  jojikNanoId: z.string(),
  domainNameSearch: z.string().optional(),
  sortByOption: z.string().optional(),
  pageSize: z.number().optional(),
  pageNumber: z.number().optional(),
  isHwalseongFilters: z.array(z.boolean()).optional(),
});
export type GetEmailDomainsRequest = z.infer<typeof GetEmailDomainsRequestSchema>;

export const PaginationDataSchema = z.object({
  hasNextPage: z.boolean(),
  pageItemCount: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalItemCount: z.number(),
  totalPageCount: z.number(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const EmailDomainListItemSchema = z.object({
  name: z.string(),
  domain: z.string(),
  nanoId: z.string(),
  isHwalseong: z.boolean(),
  createdAt: z.string(),
});
export type EmailDomainListItem = z.infer<typeof EmailDomainListItemSchema>;

export const GetEmailDomainsResponseSchema = z.object({
  domains: z.array(EmailDomainListItemSchema),
  paginationData: PaginationDataSchema.optional(),
});
export type GetEmailDomainsResponse = z.infer<typeof GetEmailDomainsResponseSchema>;

export const GetEmailDomainDetailResponseSchema = z.object({
  name: z.string(),
  domain: z.string(),
  nanoId: z.string(),
  isHwalseong: z.boolean(),
  createdAt: z.string(),
});
export type GetEmailDomainDetailResponse = z.infer<typeof GetEmailDomainDetailResponseSchema>;

export const UpdateEmailDomainRequestSchema = z.object({
  name: z.string().optional(),
  isHwalseong: z.boolean().optional(),
});
export type UpdateEmailDomainRequest = z.infer<typeof UpdateEmailDomainRequestSchema>;

export const UpdateEmailDomainResponseSchema = z.object({
  name: z.string(),
  domain: z.string(),
  nanoId: z.string(),
  isHwalseong: z.boolean(),
  createdAt: z.string(),
});
export type UpdateEmailDomainResponse = z.infer<typeof UpdateEmailDomainResponseSchema>;

export const EmailDomainBalsinjaSchema = z.object({
  name: z.string(),
  emailAddress: z.string(),
  sangtae: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  displayName: z.string(),
});
export type EmailDomainBalsinja = z.infer<typeof EmailDomainBalsinjaSchema>;

export const GetEmailDomainBalsinjasResponseSchema = z.object({
  balsinjas: z.array(EmailDomainBalsinjaSchema),
});
export type GetEmailDomainBalsinjasResponse = z.infer<typeof GetEmailDomainBalsinjasResponseSchema>;
