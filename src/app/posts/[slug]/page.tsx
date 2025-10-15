
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/posts';
import products from '@/lib/products.json';
import { PostClientWrapper } from '@/components/post-client-wrapper';
import type { Metadata } from 'next';

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
  
  const sameCategoryPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  
  const selectedSlugs = new Set([post.slug, ...sameCategoryPosts.map(p => p.slug)]);
  
  const otherPosts = allPosts.filter(p => !selectedSlugs.has(p.slug));
  const shuffledOthers = otherPosts.sort(() => 0.5 - Math.random());
  
  const randomPosts = shuffledOthers.slice(0, 6 - sameCategoryPosts.length);

  const relatedPosts = [...sameCategoryPosts, ...randomPosts];
  
  const relatedProducts = getRandomProducts(products, 5);

  return (
    <PostClientWrapper 
      post={post}
      relatedPosts={relatedPosts}
      relatedProducts={relatedProducts}
    />
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  const url = `${siteUrl}/posts/${post.slug}`;
  const title = post.title;
  const description = post.excerpt;

  return {
    title: title,
    description: description,
    keywords: post.keywords || [post.category, post.title],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'article',
      article: {
        publishedTime: post.date,
        authors: [post.author],
        tags: post.keywords,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  }
}

export async function generateStaticParams() {
  const posts = getPosts();
 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
