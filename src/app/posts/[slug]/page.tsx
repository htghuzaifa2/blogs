
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import type { Post } from '@/lib/posts';
import { RelatedPosts } from '@/components/related-posts';
import { RelatedProducts } from '@/components/related-products';
import { getPostBySlug, getPosts } from '@/lib/posts';
import products from '@/lib/products.json';
import { Skeleton } from '@/components/ui/skeleton';

const CodeCopyButton = dynamic(() => import('@/components/code-copy-button').then(m => m.CodeCopyButton), { ssr: false });

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

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const postData = await getPostBySlug(params.slug);

      if (!postData) {
        notFound();
        return;
      }

      const allPosts = getPosts();

      const sameCategoryPosts = allPosts
        .filter(p => p.category === postData.category && p.slug !== postData.slug)
        .slice(0, 6);

      const selectedSlugs = new Set([postData.slug, ...sameCategoryPosts.map(p => p.slug)]);
      
      const otherPosts = allPosts.filter(p => !selectedSlugs.has(p.slug));
      
      const shuffledOthers = otherPosts.sort(() => 0.5 - Math.random());
      
      const randomPosts = shuffledOthers.slice(0, 5);

      const combinedRelatedPosts = [...sameCategoryPosts, ...randomPosts];
      const randomProductsData = getRandomProducts(products, 5);

      setPost(postData);
      setRelatedPosts(combinedRelatedPosts);
      setRelatedProducts(randomProductsData);
      setLoading(false);
    }

    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-background">
        <main className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-6 w-48 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="bg-background">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-all duration-300 ease-in-out hover:-translate-x-1">
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:translate-x-0" />
              Back to all posts
            </Link>
            <article>
              <header className="mb-8">
                {post.category && (
                  <Link href={`/category/${post.category.toLowerCase().replace(/ /g, '-')}`}>
                     <Badge variant="secondary" className="mb-2 hover:bg-primary/20 transition-colors">
                      {post.category}
                    </Badge>
                  </Link>
                )}
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 break-words">
                  {post.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                  <span>By {post.author}</span>
                </div>
              </header>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-p:leading-relaxed prose-p:font-body
                           prose-a:text-primary hover:prose-a:text-primary/80
                           prose-strong:font-semibold
                           prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                           prose-headings:font-headline prose-headings:tracking-tight 
                           prose-h1:text-3xl prose-h1:sm:text-4xl
                           prose-h2:text-2xl prose-h2:sm:text-3xl
                           [&>p:first-of-type]:text-xl [&>p:first-of-type]:font-light [&>p:first-of-type]:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            </article>
            
            <CodeCopyButton />
            
            {relatedProducts.length > 0 && (
              <>
                <hr className="my-12 border-border" />
                <RelatedProducts products={relatedProducts} />
              </>
            )}

            {relatedPosts.length > 0 && (
              <>
                <hr className="my-12 border-border" />
                <RelatedPosts posts={relatedPosts} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
