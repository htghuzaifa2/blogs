
import { getPostBySlug, getPosts, Post } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PostClientWrapper } from '@/components/post-client-wrapper';

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

  return (
    <PostClientWrapper post={post} relatedPosts={relatedPosts} />
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  const url = `/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: url,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}
