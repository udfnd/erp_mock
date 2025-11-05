'use client';

import { Global } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { configureUnauthorizedHandler } from '@/global';
import { globalStyles } from '@/global/style';
import { clearAuthState, initializeAuthStore } from '@/global/auth';

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
      <UnauthorizedRedirector queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  );
}

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
        clearAuthState();
        queryClient.clear();
      } finally {
        router.replace('/td/g');
      }
    });
    return () => configureUnauthorizedHandler(null);
  }, [queryClient, router]);

  return null;
}
