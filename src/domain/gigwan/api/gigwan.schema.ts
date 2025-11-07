import { z } from 'zod';

export const BoonSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
});
export type Boon = z.infer<typeof BoonSchema>;

export const KonSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  boons: z.array(BoonSchema),
});
export type Kon = z.infer<typeof KonSchema>;

export const SueopSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  kons: z.array(KonSchema),
});
export type Sueop = z.infer<typeof SueopSchema>;

export const JojikSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sueops: z.array(SueopSchema),
});
export type Jojik = z.infer<typeof JojikSchema>;

export const GigwanSidebarResponseSchema = z.object({
  jojiks: z.array(JojikSchema),
});
export type GigwanSidebarResponse = z.infer<typeof GigwanSidebarResponseSchema>;

export const GigwanBasicGetSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type GigwanBasicGet = z.infer<typeof GigwanBasicGetSchema>;

export const GigwanGetSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  intro: z.string().nullable(),
});
export type GigwanGet = z.infer<typeof GigwanGetSchema>;

export const UpdateGigwanRequestSchema = z.object({
  name: z.string().trim().max(30).optional(),
  intro: z.string().trim().max(100).optional(),
});
export type UpdateGigwanRequest = z.infer<typeof UpdateGigwanRequestSchema>;

export const UpdateGigwanResponseSchema = GigwanBasicGetSchema;
export type UpdateGigwanResponse = z.infer<typeof UpdateGigwanResponseSchema>;

export const EmploymentSangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  isHwalseong: z.boolean(),
});
export type EmploymentSangtae = z.infer<typeof EmploymentSangtaeSchema>;

export const EmploymentCategorySchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  sangtaes: z.array(EmploymentSangtaeSchema),
});
export type EmploymentCategory = z.infer<typeof EmploymentCategorySchema>;

export const GetEmploymentCategoriesResponseSchema = z.object({
  categories: z.array(EmploymentCategorySchema),
});
export type GetEmploymentCategoriesResponse = z.infer<typeof GetEmploymentCategoriesResponseSchema>;

export const UpsertEmploymentCategoriesRequestSchema = z.object({
  categories: z.array(
    z.object({
      nanoId: z.string(),
      sangtaes: z.array(
        z
          .object({
            nanoId: z.string().optional(),
            name: z.string(),
            isHwalseong: z.boolean(),
          })
          .strict(),
      ),
    }),
  ),
});
export type UpsertEmploymentCategoriesRequest = z.infer<
  typeof UpsertEmploymentCategoriesRequestSchema
>;

export const UpsertEmploymentCategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      nanoId: z.string(),
      name: z.string(),
      sangtaes: z.array(
        z.object({
          nanoId: z.string(),
          name: z.string(),
          isHwalseong: z.boolean(),
        }),
      ),
    }),
  ),
});
export type UpsertEmploymentCategoriesResponse = z.infer<
  typeof UpsertEmploymentCategoriesResponseSchema
>;

export const WorkTypeSangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  isHwalseong: z.boolean(),
});
export type WorkTypeSangtae = z.infer<typeof WorkTypeSangtaeSchema>;

export const GetWorkTypeSangtaesResponseSchema = z.object({
  sangtaes: z.array(WorkTypeSangtaeSchema),
});
export type GetWorkTypeSangtaesResponse = z.infer<typeof GetWorkTypeSangtaesResponseSchema>;

export const UpsertWorkTypeSangtaesRequestSchema = z.object({
  sangtaes: z.array(
    z.object({
      nanoId: z.string().optional(),
      name: z.string(),
      isHwalseong: z.boolean(),
    }),
  ),
});
export type UpsertWorkTypeSangtaesRequest = z.infer<typeof UpsertWorkTypeSangtaesRequestSchema>;

export const UpsertWorkTypeSangtaesResponseSchema = z.object({
  sangtaes: z.array(WorkTypeSangtaeSchema),
});
export type UpsertWorkTypeSangtaesResponse = z.infer<typeof UpsertWorkTypeSangtaesResponseSchema>;
