export const gigwanQueryKeys = {
  all: ['gigwan'] as const,
  byNanoId: (nanoId: string) => [...gigwanQueryKeys.all, nanoId] as const,
  detail: (nanoId: string) => [...gigwanQueryKeys.byNanoId(nanoId), 'detail'] as const,
  name: (nanoId: string) => [...gigwanQueryKeys.byNanoId(nanoId), 'name'] as const,
  sidebar: (nanoId: string) => [...gigwanQueryKeys.byNanoId(nanoId), 'sidebar'] as const,
  employmentCategories: (nanoId: string) =>
    [...gigwanQueryKeys.byNanoId(nanoId), 'employmentCategories'] as const,
  workTypeCustomSangtaes: (nanoId: string) =>
    [...gigwanQueryKeys.byNanoId(nanoId), 'workTypeCustomSangtaes'] as const,
};

type ValueOf<T> = T[keyof T];

type QueryKeyCreator = (...args: never[]) => readonly unknown[];

type ExtractQueryKey<T> = T extends QueryKeyCreator ? ReturnType<T> : never;

export type GigwanQueryKey = ExtractQueryKey<ValueOf<typeof gigwanQueryKeys>>;
