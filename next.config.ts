
import type {NextConfig} from 'next';
import fs from 'fs';
import path from 'path';
import { getPosts } from './src/lib/posts';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'huzi.pk',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const posts = getPosts();
      // Ensure search data includes the category for filtering
      const searchData = posts.map(post => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author,
        category: post.category, // Add category here
      }));
      fs.writeFileSync(path.join(process.cwd(), 'public/search-data.json'), JSON.stringify(searchData));
    }
    return config;
  },
};

export default nextConfig;
