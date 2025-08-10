import { getPostBySlug, getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Comments } from '@/components/comments';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

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
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
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
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={post.imageHint}
                  priority
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
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            </article>

            <hr className="my-12 border-border" />
            
            <Comments />
          </div>
        </div>
      </main>
    </div>
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
