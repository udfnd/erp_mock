import { z } from 'zod';

export const GetHadaAllimChannelsRequestSchema = z.object({
  jojikNanoId: z.string(),
});
export type GetHadaAllimChannelsRequest = z.infer<typeof GetHadaAllimChannelsRequestSchema>;

export const HadaAllimChannelListItemSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  sangtae: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  nanoId: z.string(),
});
export type HadaAllimChannelListItem = z.infer<typeof HadaAllimChannelListItemSchema>;

export const GetHadaAllimChannelsResponseSchema = z.object({
  allimChannels: z.array(HadaAllimChannelListItemSchema),
});
export type GetHadaAllimChannelsResponse = z.infer<typeof GetHadaAllimChannelsResponseSchema>;
