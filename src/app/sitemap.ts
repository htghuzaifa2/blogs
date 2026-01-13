
import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogs.huzi.pk';
  const posts = getPosts();

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.date), 
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categories = new Set(posts.map(post => post.category).filter(Boolean));
  const categoryUrls = Array.from(categories).map(category => ({
      url: `${siteUrl}/category/${encodeURIComponent(category!.toLowerCase().replace(/ /g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
  }));

  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
        url: `${siteUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
    }
  ];

  return [
    ...staticUrls,
    ...postUrls,
    ...categoryUrls,
  ];
}
