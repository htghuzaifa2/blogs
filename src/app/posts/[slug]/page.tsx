import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getPostBySlug, getPosts, Post } from '@/lib/posts';
import productsData from '@/lib/products.json';
import { PostClientWrapper } from '@/components/post-client-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';

// Remove runtime = 'edge' to allow Node.js fs usage
// export const runtime = 'edge';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

const products = productsData as Product[];

function getRandomProducts(allProducts: Product[], count: number, excludeSlug?: string): Product[] {
  const shuffled = [...allProducts]
    .filter(p => p.slug !== excludeSlug)
    .sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Huzi Blogs',
    };
  }

  return {
    title: `${post.title} - Huzi Blogs`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
      tags: post.keywords,
      images: [
        {
          url: post.imageUrl || 'https://huzi.pk/img/26PWX8FW/logo.webp',
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl || 'https://huzi.pk/img/26PWX8FW/logo.webp']
    }
  };
}

function PostPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-2" />
      <Skeleton className="h-10 md:h-12 w-full mb-4" />
      <Skeleton className="h-5 w-1/2 mb-8" />

      <div className="space-y-4 mt-8">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  )
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Determine related posts
  const allPosts = getPosts();
  const sameCategoryPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Create a Set for faster lookup to avoid duplicates
  const selectedSlugs = new Set([post.slug, ...sameCategoryPosts.map(p => p.slug)]);

  // Filter remaining posts
  const otherPosts = allPosts.filter(p => !selectedSlugs.has(p.slug));

  // Shuffle and pick random posts to fill up to 6
  const shuffledOthers = otherPosts.sort(() => 0.5 - Math.random());
  const randomPosts = shuffledOthers.slice(0, 6 - sameCategoryPosts.length);

  const relatedPosts = [...sameCategoryPosts, ...randomPosts];

  // Determine related products
  const relatedProducts = getRandomProducts(products, 5);

  return (
    <Suspense fallback={<PostPageSkeleton />}>
      <PostClientWrapper
        post={post}
        relatedPosts={relatedPosts}
        relatedProducts={relatedProducts}
      />
    </Suspense>
  );
}
