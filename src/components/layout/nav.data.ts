
export type NavItem = {
  name: string;
  /** 동적 파라미터를 포함한 전체 경로 (예: /td/np/gis/[gi]/manage/home/dv) */
  href: string;
  /** TertiaryNav를 판단하기 위한 경로 패턴 (예: /td/np/gis/[gi]/manage) */
  basePath?: string;
  /** 하위 내비게이션 아이템 */
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
  params: { [key: string]: string | string[] | undefined },
) => {
  let dynamicHref = href;
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      dynamicHref = dynamicHref.replace(`[${key}]`, value);
    } else if (Array.isArray(value)) {
      dynamicHref = dynamicHref.replace(`[${key}]`, value[0]);
    }
  });
  return dynamicHref;
};

// IA Depth 2: Primary Nav
export const primaryNavItems: NavItem[] = [
  {
    name: '기관 관리', // { 기관 }
    href: '/td/np/gis/[gi]',
    basePath: '/td/np/gis',
  },
  {
    name: '조직 관리', // { 조직 }
    href: '/td/np/jos/[jo]',
    basePath: '/td/np/jos',
  },
];

// IA Depth 3 & 4: Secondary & Tertiary Nav
export const secondaryNavItems: Record<string, NavItem[]> = {
  // '기관 관리'의 하위 메뉴
  '/td/np/gis': [
    {
      name: '{기관명} 관리', // IA Depth 3
      href: '/td/np/gis/[gi]/manage/home/dv',
      basePath: '/td/np/gis/[gi]/manage',
      items: [ // IA Depth 4
        {name: '홈', href: '/td/np/gis/[gi]/manage/home/dv'},
        {name: '기관 설정', href: '/td/np/gis/[gi]/manage/setting/sv'},
      ],
    },
    {
      name: '조직들',
      href: '/td/np/gis/[gi]/jojiks/home/lv',
      basePath: '/td/np/gis/[gi]/jojiks',
    },
    {
      name: '사용자들',
      href: '/td/np/gis/[gi]/sayongjas/home/lv',
      basePath: '/td/np/gis/[gi]/sayongjas',
    },
    {
      name: '권한들',
      href: '/td/np/gis/[gi]/permissions/home/lv',
      basePath: '/td/np/gis/[gi]/permissions',
      items: [
        {name: '권한들', href: '/td/np/gis/[gi]/permissions/home/lv'},
        {name: '권한 그룹들', href: '/td/np/gis/[gi]/permissions/permission-groups/lv'},
      ],
    },
  ],
  // '조직 관리'의 하위 메뉴
  '/td/np/jos': [
    {
      name: '{조직명} 관리', // IA Depth 3
      href: '/td/np/jos/[jo]/manage/home/dv',
      basePath: '/td/np/jos/[jo]/manage',
      items: [ // IA Depth 4
        {name: '홈', href: '/td/np/jos/[jo]/manage/home/dv'},
        {name: '조직 설정', href: '/td/np/jos/[jo]/manage/setting/sv'},
      ],
    },
    {
      name: '자원들',
      href: '/td/np/jos/[jo]/jawons/memos/lv',
      basePath: '/td/np/jos/[jo]/jawons',
      items: [
        {name: '메모들', href: '/td/np/jos/[jo]/jawons/memos/lv'},
        {name: '외부링크들', href: '/td/np/jos/[jo]/jawons/oebu-links/lv'},
        {name: '주소들', href: '/td/np/jos/[jo]/jawons/jusos/lv'},
      ],
    },
  ],
};
