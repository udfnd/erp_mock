export type NavItem = {
  name: string;
  href: string;
  basePath?: string;
  items?: NavItem[];
};

/**
 * 동적 경로를 현재 파라미터에 맞게 변환합니다.
 * @param href - /td/np/gis/[gi]/manage...
 * @param params - { gi: '123' } (useParams()의 반환값)
 * @returns /td/np/gis/123/manage...
 */
export const getDynamicHref = (
  href: string,
  params?: { [key: string]: string | string[] | undefined },
): string | null => {
  const hasDynamicSegment = href.includes('[');

  if (!params || Object.keys(params).length === 0) {
    return hasDynamicSegment ? null : href;
  }

  let dynamicHref = href;
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      dynamicHref = dynamicHref.replace(`[${key}]`, value);
    } else if (Array.isArray(value) && value.length > 0) {
      dynamicHref = dynamicHref.replace(`[${key}]`, value[0]);
    }
  });

  return dynamicHref.includes('[') ? null : dynamicHref;
};
