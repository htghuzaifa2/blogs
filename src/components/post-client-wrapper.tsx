
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import type { Post } from '@/lib/posts';

const Comments = dynamic(() => import('@/components/comments').then(m => m.Comments), { ssr: false });
const CodeCopyButton = dynamic(() => import('@/components/code-copy-button').then(m => m.CodeCopyButton), { ssr: false });

interface PostClientWrapperProps {
  post: Post;
}

export function PostClientWrapper({ post }: PostClientWrapperProps) {
  const hasImage = post.imageUrl;
  
  return (
    <div className="bg-background">
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft size={16} />
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
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                  {post.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                  <span>By {post.author}</span>
                </div>
              </header>

              {hasImage && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                    priority
                  />
                </div>
              )}

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-headings:font-headline prose-headings:tracking-tight 
                           prose-p:leading-relaxed prose-p:font-body
                           prose-a:text-primary hover:prose-a:text-primary/80
                           prose-strong:font-semibold
                           prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                           prose-ul:list-disc prose-ol:list-decimal
                           prose-h1:text-3xl prose-h1:sm:text-4xl
                           prose-h2:text-2xl prose-h2:sm:text-3xl
                           [&>p:first-of-type]:text-xl [&>p:first-of-type]:font-light"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            </article>
            
            <CodeCopyButton />
            <hr className="my-12 border-border" />
            
            <Comments />
          </div>
        </div>
      </main>
    </div>
  );
}
