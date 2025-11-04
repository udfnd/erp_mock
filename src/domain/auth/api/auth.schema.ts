import { z } from 'zod';

export const SignInRequestSchema = z.object({
  id: z.string(),
  password: z.string(),
  gigwanNanoId: z.string(),
});

export const SignInResponseSchema = z.object({
  accessToken: z.string(),
  nanoId: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

const SangtaeSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  isHwalseong: z.boolean(),
});

const PermissionSchema = z.object({
  nanoId: z.string(),
  name: z.string(),
  role: z.string(),
});

export const MyProfileResponseSchema = z.object({
  name: z.string(),
  nanoId: z.string(),
  employedAt: z.string(),
  isHwalseong: z.boolean(),
  workTypeSangtae: SangtaeSchema.nullable(),
  employmentSangtae: SangtaeSchema.nullable(),
  loginId: z.string(),
  createdAt: z.string(),
  permissions: z.array(PermissionSchema),
});

export const UpdatePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export const UpdatePasswordResponseSchema = z.object({});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type MyProfileResponse = z.infer<typeof MyProfileResponseSchema>;
export type UpdatePasswordRequest = z.infer<typeof UpdatePasswordRequestSchema>;
export type UpdatePasswordResponse = z.infer<typeof UpdatePasswordResponseSchema>;
