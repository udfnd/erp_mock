'use client';

import { css } from '@emotion/react';
import type { ReactNode } from 'react';

import { PrimaryNav } from '@/global/navigation';
import {
  NavigationHierarchyProvider,
  useSetNavigationHierarchy,
} from '@/global/navigation/NavigationHierarchyContext';

const layoutStyles = css({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#fff',
});

const contentStyles = css({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#fff',
});

type NavigationFrameProps = {
  children: ReactNode;
};

function NavigationFrameContent({ children }: NavigationFrameProps) {
  const setHierarchy = useSetNavigationHierarchy();

  return (
    <div css={layoutStyles}>
      <PrimaryNav onHierarchyChange={setHierarchy} />
      <div css={contentStyles}>{children}</div>
    </div>
  );
}

export function NavigationFrame({ children }: NavigationFrameProps) {
  return (
    <NavigationHierarchyProvider>
      <NavigationFrameContent>{children}</NavigationFrameContent>
    </NavigationHierarchyProvider>
  );
}
