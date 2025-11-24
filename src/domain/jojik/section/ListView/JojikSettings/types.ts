import { useUpdateJojikMutation, useDeleteJojikMutation } from '@/domain/jojik/api';

export type UpdateJojikMutationResult = ReturnType<typeof useUpdateJojikMutation>;

export type DeleteJojikMutationResult = ReturnType<typeof useDeleteJojikMutation>;
