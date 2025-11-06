import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from './providers';
import { pretendard } from '@/style/fonts/pretendard';

export const metadata: Metadata = {
  title: 'erp',
  description: 'erp system',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" css={pretendard.variable}>
      <body css={pretendard.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
