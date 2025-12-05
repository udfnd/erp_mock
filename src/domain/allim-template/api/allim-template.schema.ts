import { z } from 'zod';

export const GetAllimTemplatesRequestSchema = z.object({
  jojikNanoId: z.string(),
  kakaoChannelNanoId: z.string().optional(),
});
export type GetAllimTemplatesRequest = z.infer<typeof GetAllimTemplatesRequestSchema>;

export const AllimTemplateListItemSchema = z.object({
  name: z.string(),
  content: z.string(),
  type: z.string(),
  createdAt: z.string(),
  nanoId: z.string(),
  isHwalseong: z.boolean(),
  template: z.string(),
});
export type AllimTemplateListItem = z.infer<typeof AllimTemplateListItemSchema>;

export const GetAllimTemplatesResponseSchema = z.object({
  templates: z.array(AllimTemplateListItemSchema),
});
export type GetAllimTemplatesResponse = z.infer<typeof GetAllimTemplatesResponseSchema>;

export const GetAllimTemplateDetailResponseSchema = z.object({
  name: z.string(),
  type: z.string(),
  sangtae: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
});
export type GetAllimTemplateDetailResponse = z.infer<typeof GetAllimTemplateDetailResponseSchema>;

export const UpdateAllimTemplateRequestSchema = z.object({
  name: z.string().optional(),
  isHwalseong: z.boolean().optional(),
});
export type UpdateAllimTemplateRequest = z.infer<typeof UpdateAllimTemplateRequestSchema>;

export const UpdateAllimTemplateResponseSchema = GetAllimTemplateDetailResponseSchema;
export type UpdateAllimTemplateResponse = z.infer<typeof UpdateAllimTemplateResponseSchema>;
