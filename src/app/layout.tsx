import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { AppProviders } from './_components/app-providers';
import { pretendard } from '@/style/fonts/pretendard';

export const metadata: Metadata = {
  title: 'ERP Mock',
  description: 'ERP 관리 도구',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
