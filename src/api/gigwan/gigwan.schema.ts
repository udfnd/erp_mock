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
  intro: z.string(),
  juso: z.union([
    z.object({
      nanoId: z.string(),
      name: z.string(),
      fullJuso: z.string(),
    }),
    z.null(),
  ]),
});
export type GigwanGet = z.infer<typeof GigwanGetSchema>;

export const UpdateGigwanRequestSchema = z.object({
  name: z.string().optional(),
  intro: z.string().optional(),
  jusoNanoId: z.union([z.string(), z.null()]).optional(),
  logoImageNanoId: z.string().optional(),
});
export type UpdateGigwanRequest = z.infer<typeof UpdateGigwanRequestSchema>;

export const UpdateGigwanResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  intro: z.union([z.string(), z.null()]),
  juso: z.union([
    z.object({
      nanoId: z.string(),
      name: z.string(),
      fullJuso: z.string(),
    }),
    z.null(),
  ]),
});
export type UpdateGigwanResponse = z.infer<typeof UpdateGigwanResponseSchema>;

export const UpsertGigwanAddressRequestSchema = z.object({
  address: z.string(),
});
export type UpsertGigwanAddressRequest = z.infer<typeof UpsertGigwanAddressRequestSchema>;

export const UpsertGigwanAddressResponseSchema = z.object({
  address: z.string(),
  nanoId: z.string(),
});
export type UpsertGigwanAddressResponse = z.infer<typeof UpsertGigwanAddressResponseSchema>;

export const UpdateGigwanIntroRequestSchema = z.object({
  intro: z.string(),
});
export type UpdateGigwanIntroRequest = z.infer<typeof UpdateGigwanIntroRequestSchema>;

export const UpdateGigwanIntroResponseSchema = z.object({
  intro: z.string(),
  nanoId: z.string(),
});
export type UpdateGigwanIntroResponse = z.infer<typeof UpdateGigwanIntroResponseSchema>;

export const UpdateGigwanNameRequestSchema = z.object({
  name: z.string(),
});
export type UpdateGigwanNameRequest = z.infer<typeof UpdateGigwanNameRequestSchema>;

export const UpdateGigwanNameResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
});
export type UpdateGigwanNameResponse = z.infer<typeof UpdateGigwanNameResponseSchema>;

export const EmploymentSangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
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
});
export type WorkTypeSangtae = z.infer<typeof WorkTypeSangtaeSchema>;

export const GetWorkTypeSangtaesResponseSchema = z.object({
  sangtaes: z.array(WorkTypeSangtaeSchema),
});
export type GetWorkTypeSangtaesResponse = z.infer<typeof GetWorkTypeSangtaesResponseSchema>;

export const UpsertWorkTypeSangtaesRequestSchema = z.object({
  statuses: z.array(
    z.object({
      nanoId: z.string(),
      name: z.string(),
    }),
  ),
});
export type UpsertWorkTypeSangtaesRequest = z.infer<typeof UpsertWorkTypeSangtaesRequestSchema>;

export const UpsertWorkTypeSangtaesResponseSchema = z.object({
  sangtaes: z.array(WorkTypeSangtaeSchema),
});
export type UpsertWorkTypeSangtaesResponse = z.infer<typeof UpsertWorkTypeSangtaesResponseSchema>;
