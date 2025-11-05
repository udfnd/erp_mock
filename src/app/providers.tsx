'use client';

import { Global, css } from '@emotion/react';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { configureUnauthorizedHandler } from '@/global';
import { initializeAuthStore } from '@/global/auth';

type AppProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError | undefined;
              const status = axiosError?.response?.status;
              if (status === 401) return false;
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: (failureCount, error) => {
              const axiosError = error as AxiosError | undefined;
              const status = axiosError?.response?.status;
              if (status === 401) return false;
              return failureCount < 1;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <Global styles={globalStyles} />
      {/* 전역 401 처리기 등록 */}
      <UnauthorizedRedirector queryClient={queryClient} />
      <HydrationBoundary>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

const globalStyles = css({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  body: {
    margin: 0,
    minHeight: '100vh',
    backgroundColor: '#F3F5FA',
    color: '#2E3446',
    fontFamily: 'inherit',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  'button, input, textarea, select': {
    font: 'inherit',
  },
  ':root': {
    colorScheme: 'light',
  },
});

function AuthInitializer() {
  useEffect(() => {
    initializeAuthStore();
  }, []);

  return null;
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
