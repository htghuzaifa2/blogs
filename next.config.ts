
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
  webpack: (config, { isServer, defaultLoaders }) => {
    if (isServer) {
      const posts = getPosts();
      
      // Now we need the full HTML content for the client-side post pages.
      const searchData = posts.map(post => {
        // Since getPosts now only returns content, we'd need to process it.
        // Let's adjust getPosts to handle this better. For now, we will
        // create a separate function to get post with HTML content.
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
