import type { ComponentType, SVGProps } from 'react';

import {
  DriveIcon,
  FileIcon,
  HomepageIcon,
  InstagramIcon,
  WebIcon,
  YoutubeIcon,
} from '@/common/icons';

export type LinkIconOption = {
  label: string;
  value: string;
  iconName?: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type LinkIconDto = {
  name: string;
  nanoId: string;
};

const LINK_ICON_COMPONENTS: Record<LinkIconDto['name'], ComponentType<SVGProps<SVGSVGElement>> | undefined> = {
  YOUTUBE: YoutubeIcon,
  INSTAGRAM: InstagramIcon,
  HOMEPAGE: HomepageIcon,
  GOOGLEDRIVE: DriveIcon,
  WEB: WebIcon,
  FILE: FileIcon,
};

export const mapLinkIconsToOptions = (linkIcons: LinkIconDto[] | undefined): LinkIconOption[] =>
  linkIcons?.map((icon) => ({
    label: icon.name,
    value: icon.nanoId,
    iconName: icon.name,
    Icon: LINK_ICON_COMPONENTS[icon.name],
  })) ?? [];

export const createLinkIconLookup = (
  options: LinkIconOption[],
): Map<string, ComponentType<SVGProps<SVGSVGElement>> | undefined> => {
  const map = new Map<string, ComponentType<SVGProps<SVGSVGElement>> | undefined>();

  options.forEach((option) => {
    map.set(option.value, option.Icon);
  });

  return map;
};
