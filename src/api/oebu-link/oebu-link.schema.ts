import { z } from 'zod';

export const OebuLinkListItemSchema = z.object({
  linkIcon: z.string(),
  nanoId: z.string(),
  linkUrl: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  asName: z.string(),
  name: z.string(),
});
export type OebuLinkListItem = z.infer<typeof OebuLinkListItemSchema>;

export const GetOebuLinksResponseSchema = z.object({
  oebuLinks: z.array(OebuLinkListItemSchema),
});
export type GetOebuLinksResponse = z.infer<typeof GetOebuLinksResponseSchema>;

export const OebuLinkDetailSchema = OebuLinkListItemSchema.extend({
  updatedAt: z.string(),
  updatedBy: z.string(),
});
export type OebuLinkDetail = z.infer<typeof OebuLinkDetailSchema>;

export const CreateOebuLinkRequestSchema = z.object({
  gigwanNanoId: z.string(),
  name: z.string(),
  asName: z.string(),
  linkUrl: z.string(),
  linkIconNanoId: z.string(),
});
export type CreateOebuLinkRequest = z.infer<typeof CreateOebuLinkRequestSchema>;

export const CreateOebuLinkResponseSchema = OebuLinkDetailSchema;
export type CreateOebuLinkResponse = z.infer<typeof CreateOebuLinkResponseSchema>;

export const GetOebuLinkDetailResponseSchema = OebuLinkDetailSchema;
export type GetOebuLinkDetailResponse = z.infer<typeof GetOebuLinkDetailResponseSchema>;

export const UpdateOebuLinkRequestSchema = z.object({
  name: z.string(),
  asName: z.string(),
  linkUrl: z.string(),
  linkIconNanoId: z.string(),
});
export type UpdateOebuLinkRequest = z.infer<typeof UpdateOebuLinkRequestSchema>;

export const UpdateOebuLinkResponseSchema = OebuLinkDetailSchema;
export type UpdateOebuLinkResponse = z.infer<typeof UpdateOebuLinkResponseSchema>;

export const DeleteOebuLinkResponseSchema = z.object({});
export type DeleteOebuLinkResponse = z.infer<typeof DeleteOebuLinkResponseSchema>;
