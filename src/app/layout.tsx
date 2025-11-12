import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from './providers';
import { ToastProvider } from '@/common/components/Toast';
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
        <Providers>
          <ToastProvider>{children}</ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
