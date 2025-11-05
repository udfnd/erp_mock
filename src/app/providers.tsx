'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { configureUnauthorizedHandler } from '@/global';

type AppProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* 전역 401 처리기 등록 */}
      <UnauthorizedRedirector queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  );
}

function UnauthorizedRedirector({ queryClient }: { queryClient: QueryClient }) {
  const router = useRouter();

  useEffect(() => {
    configureUnauthorizedHandler(() => {
      try {
        // 필요 시 전역 상태/스토어도 함께 초기화
        queryClient.clear(); // 모든 React Query 캐시 제거
      } finally {
        router.replace('/td/g'); // 기관 코드 입력 페이지로 이동
      }
    });
    return () => configureUnauthorizedHandler(null);
  }, [queryClient, router]);

  return null;
}
