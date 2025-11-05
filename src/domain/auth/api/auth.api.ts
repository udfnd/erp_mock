import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/global';

import {
  MyProfileResponse,
  MyProfileResponseSchema,
  RefreshTokenResponse,
  RefreshTokenResponseSchema,
  SignInRequest,
  SignInRequestSchema,
  SignInResponse,
  SignInResponseSchema,
  UpdatePasswordRequest,
  UpdatePasswordRequestSchema,
  UpdatePasswordResponse,
  UpdatePasswordResponseSchema,
} from './auth.schema';

const parseOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const r = schema.safeParse(data);
  if (!r.success) {
    const e = new Error('ZodParseError');
    (e as any).zod = r.error;
    throw e;
  }
  return r.data;
};

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const validated = SignInRequestSchema.parse(data);
  const res = await apiClient.post('T/dl/sayongjas/sign-in', validated);
  return parseOrThrow(SignInResponseSchema, res.data);
};

export const useSignInMutation = () => {
  return useMutation<SignInResponse, unknown, SignInRequest>({ mutationFn: signIn });
};

export const refreshAccessToken = async (nanoId: string): Promise<RefreshTokenResponse> => {
  const res = await apiClient.post(
    `T/dl/sayongjas/${encodeURIComponent(nanoId)}/refresh-access`,
    {},
  );
  return parseOrThrow(RefreshTokenResponseSchema, res.data);
};

export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const res = await apiClient.get('/T/feat/sayongjas/my-profile');
  return parseOrThrow(MyProfileResponseSchema, res.data);
};

export const useGetMyProfileQuery = (options?: { enabled?: boolean }) => {
  return useQuery<MyProfileResponse, unknown>({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
    ...options,
  });
};

export const updateMyPassword = async (
  data: UpdatePasswordRequest,
): Promise<UpdatePasswordResponse> => {
  const validated = UpdatePasswordRequestSchema.parse(data);
  const res = await apiClient.put('/T/feat/sayongjas/my-password', validated);
  return parseOrThrow(UpdatePasswordResponseSchema, res.data);
};

export const useUpdateMyPasswordMutation = () => {
  return useMutation<UpdatePasswordResponse, unknown, UpdatePasswordRequest>({
    mutationFn: updateMyPassword,
  });
};
