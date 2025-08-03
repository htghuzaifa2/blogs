

import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Comments } from '@/components/comments';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft size={16} />
              Back to all posts
            </Link>
            <article>
              <header className="mb-8">
                <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                  {post.title}
                </h1>
                <div className="text-sm text-muted-foreground">
                  <span>By {post.author}</span>
                </div>
              </header>

              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={post.imageHint}
                />
              </div>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-headings:font-headline prose-headings:tracking-tight 
                           prose-p:leading-relaxed prose-p:font-body
                           prose-a:text-primary hover:prose-a:text-primary/80
                           prose-strong:font-semibold
                           prose-blockquote:border-primary prose-blockquote:text-muted-foreground
                           prose-ul:list-disc prose-ol:list-decimal
                           [&>p:first-of-type]:text-xl [&>p:first-of-type]:font-light"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            <hr className="my-12 border-border" />
            
            <Comments />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} | blogs.huzi.pk`,
    description: post.excerpt,
  }
}
