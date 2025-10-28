import path from 'node:path';

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin();

const skipReactRefreshLoaderPath = path.join(
  process.cwd(),
  'config/loaders/skipReactRefreshLoader.cjs',
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.css\.tsx?$/,
      enforce: 'pre',
      include: [path.join(process.cwd(), 'src')],
      use: [
        {
          loader: skipReactRefreshLoaderPath,
        },
      ],
    });

    return config;
  },
};

export default withVanillaExtract(nextConfig);
