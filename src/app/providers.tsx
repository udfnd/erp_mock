'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { useServerInsertedHTML, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { configureUnauthorizedHandler } from '@/global';
import { clearAuthState, initializeAuthStore } from '@/global/auth';
import { globalStyles } from '@/global/style';

const cache = createCache({ key: 'css', prepend: true });
cache.compat = true;

type AppProvidersProps = { children: ReactNode };

export function Providers({ children }: AppProvidersProps) {
  const router = useRouter();

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

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    const names = entries.map(([k]) => k).join(' ');
    const cssText = entries.map(([, v]) => v).join(' ');
    cache.inserted = {};

    return (
      <style
        data-emotion={`${cache.key} ${names}`}
        dangerouslySetInnerHTML={{ __html: cssText as string }}
      />
    );
  });

  useEffect(() => {
    initializeAuthStore();
  }, []);

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

  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <Global styles={globalStyles} />
        {children}
      </QueryClientProvider>
    </CacheProvider>
  );
}
