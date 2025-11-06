'use client';

import React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

const cache = createCache({ key: 'css', prepend: true });
(cache as any).compat = true;

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) return null;

    const names = entries.map(([k]) => k).join(' ');
    const cssText = entries.map(([, v]) => v).join(' ');

    (cache as any).inserted = {};

    return (
      <style data-emotion={`${cache.key} ${names}`} dangerouslySetInnerHTML={{ __html: cssText }} />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
