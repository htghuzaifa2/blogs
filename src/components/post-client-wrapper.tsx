
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import type { Post } from '@/lib/posts';
import { RelatedPosts } from './related-posts';
import { RelatedProducts } from './related-products';

const CodeCopyButton = dynamic(() => import('@/components/code-copy-button').then(m => m.CodeCopyButton), { ssr: false });

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface PostClientWrapperProps {
  post: Post;
  relatedPosts: Post[];
  relatedProducts: Product[];
}

export function PostClientWrapper({ post, relatedPosts, relatedProducts }: PostClientWrapperProps) {

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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground break-words">
                  {post.title}
                </h1>
                <div className="mt-4 text-sm text-muted-foreground">
                  <span>
                    By <a href="https://huzi.huzi.pk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors cursor-pointer">{post.author}</a>
                  </span>
                </div>
              </header>

              <div
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-p:leading-relaxed prose-p:font-body
                           prose-a:text-primary hover:prose-a:text-primary/80
                           prose-strong:font-semibold
                           prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                           prose-headings:font-headline prose-headings:tracking-tight 
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
