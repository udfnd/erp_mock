'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useState } from 'react';

type EmotionCacheProviderProps = {
  children: ReactNode;
};

const createEmotionCache = () => {
  const cache = createCache({ key: 'css', prepend: true });
  cache.compat = true;
  return cache;
};

export function EmotionCacheProvider({ children }: EmotionCacheProviderProps) {
  const [cache] = useState(createEmotionCache);

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    cache.inserted = {};

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${entries.map(([key]) => key).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: entries.map(([, value]) => value).join(' ') }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
