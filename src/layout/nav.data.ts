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

export const primaryNavItems: NavItem[] = [
  {
    name: '기관 관리',
    href: '/td/np/gis/[gi]',
    basePath: '/td/np/gis',
  },
  {
    name: '조직 관리',
    href: '/td/np/jos/[jo]',
    basePath: '/td/np/jos',
  },
];

export const secondaryNavItems: Record<string, NavItem[]> = {
  '/td/np/gis': [
    {
      name: '{기관명} 관리',
      href: '/td/np/gis/[gi]/manage/home/dv',
      basePath: '/td/np/gis/[gi]/manage',
      items: [
        { name: '홈', href: '/td/np/gis/[gi]/manage/home/dv' },
        { name: '기관 설정', href: '/td/np/gis/[gi]/manage/setting/sv' },
      ],
    },
    {
      name: '조직들',
      href: '/td/np/gis/[gi]/jojiks/home/lv',
      basePath: '/td/np/gis/[gi]/jojiks',
      items: [{ name: '조직들', href: '/td/np/gis/[gi]/jojiks/home/lv' }],
    },
    {
      name: '사용자들',
      href: '/td/np/gis/[gi]/sayongjas/home/lv',
      basePath: '/td/np/gis/[gi]/sayongjas',
      items: [{ name: '사용자들', href: '/td/np/gis/[gi]/sayongjas/home/lv' }],
    },
    {
      name: '권한들',
      href: '/td/np/gis/[gi]/permissions/home/lv',
      basePath: '/td/np/gis/[gi]/permissions',
      items: [
        { name: '권한들', href: '/td/np/gis/[gi]/permissions/home/lv' },
        { name: '권한 그룹들', href: '/td/np/gis/[gi]/permissions/permission-groups/lv' },
      ],
    },
  ],
  '/td/np/jos': [
    {
      name: '{조직명} 관리', // IA Depth 3
      href: '/td/np/jos/[jo]/manage/home/dv',
      basePath: '/td/np/jos/[jo]/manage',
      items: [
        // IA Depth 4
        { name: '홈', href: '/td/np/jos/[jo]/manage/home/dv' },
        { name: '조직 설정', href: '/td/np/jos/[jo]/manage/setting/sv' },
      ],
    },
    {
      name: '자원들',
      href: '/td/np/jos/[jo]/jawons/memos/lv',
      basePath: '/td/np/jos/[jo]/jawons',
      items: [
        { name: '메모들', href: '/td/np/jos/[jo]/jawons/memos/lv' },
        { name: '외부링크들', href: '/td/np/jos/[jo]/jawons/oebu-links/lv' },
        { name: '주소들', href: '/td/np/jos/[jo]/jawons/jusos/lv' },
      ],
    },
  ],
};
