export type RouteParamValue = string | string[] | undefined;

export const extractGigwanNanoId = (value: RouteParamValue): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

export const extractJojikNanoId = (value: RouteParamValue): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};
