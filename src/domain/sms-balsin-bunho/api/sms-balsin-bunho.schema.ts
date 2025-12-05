import { z } from 'zod';

export const GetSmsBalsinBunhosRequestSchema = z.object({
  jojikNanoId: z.string(),
});
export type GetSmsBalsinBunhosRequest = z.infer<typeof GetSmsBalsinBunhosRequestSchema>;

export const SmsBalsinBunhoListItemSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  phoneNumber: z.string(),
  sangtae: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
});
export type SmsBalsinBunhoListItem = z.infer<typeof SmsBalsinBunhoListItemSchema>;

export const GetSmsBalsinBunhosResponseSchema = z.object({
  balsinBunhos: z.array(SmsBalsinBunhoListItemSchema),
});
export type GetSmsBalsinBunhosResponse = z.infer<typeof GetSmsBalsinBunhosResponseSchema>;

export const GetSmsBalsinBunhoDetailRequestSchema = z.object({
  jojikNanoId: z.string(),
});
export type GetSmsBalsinBunhoDetailRequest = z.infer<typeof GetSmsBalsinBunhoDetailRequestSchema>;

export const GetSmsBalsinBunhoDetailResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  phoneNumber: z.string(),
  createdAt: z.string(),
  isHwalseong: z.boolean(),
});
export type GetSmsBalsinBunhoDetailResponse = z.infer<typeof GetSmsBalsinBunhoDetailResponseSchema>;

export const UpdateSmsBalsinBunhoRequestSchema = z.object({
  name: z.string(),
  isHwalseong: z.boolean(),
});
export type UpdateSmsBalsinBunhoRequest = z.infer<typeof UpdateSmsBalsinBunhoRequestSchema>;

export const UpdateSmsBalsinBunhoResponseSchema = GetSmsBalsinBunhoDetailResponseSchema;
export type UpdateSmsBalsinBunhoResponse = z.infer<typeof UpdateSmsBalsinBunhoResponseSchema>;
