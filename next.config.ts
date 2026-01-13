
import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';
import { getPosts } from './src/lib/posts';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'huzi.pk',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, defaultLoaders }) => {
    if (isServer) {
      const posts = getPosts();

      const searchData = posts.map(post => {
        return {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          category: post.category,
          date: post.date,
          keywords: post.keywords,
          htmlContent: post.htmlContent // IMPORTANT: Include htmlContent
        };
      });
      fs.writeFileSync(path.join(process.cwd(), 'public/search-data.json'), JSON.stringify(searchData));
    }
    return config;
  },
};

export default nextConfig;
