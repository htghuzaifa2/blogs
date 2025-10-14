
import { getPostBySlug, getPosts, Post } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PostClientWrapper } from '@/components/post-client-wrapper';
import products from '@/lib/products.json';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

function getRandomProducts(allProducts: Product[], count: number): Product[] {
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getPosts();

  // 1. Get up to 6 posts from the same category
  const sameCategoryPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 6);

  // 2. Get 5 random posts, excluding the current post and already selected related posts
  const selectedSlugs = new Set([post.slug, ...sameCategoryPosts.map(p => p.slug)]);
  
  const otherPosts = allPosts.filter(p => !selectedSlugs.has(p.slug));
  
  // Shuffle the remaining posts
  const shuffledOthers = otherPosts.sort(() => 0.5 - Math.random());
  
  const randomPosts = shuffledOthers.slice(0, 5);

  // 3. Combine them
  const relatedPosts = [...sameCategoryPosts, ...randomPosts];

  // 4. Get random products
  const randomProducts = getRandomProducts(products, 5);

  return (
    <PostClientWrapper 
      post={post} 
      relatedPosts={relatedPosts}
      relatedProducts={randomProducts}
    />
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const awaitedParams = await params;
  const post = await getPostBySlug(awaitedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  const url = `/posts/${post.slug}`;
  const keywords = post.keywords || [];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: url,
    },
     twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}
