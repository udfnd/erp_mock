import { pretendard } from '@/fonts/pretendard';

import Providers from './providers'; // 👈 오직 이 Client 래퍼만 사용

import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YourApp',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
