
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  const useFallback = imageError || post.imageUrl.includes('placehold.co');

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 border-border hover:border-primary">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 relative">
            {useFallback ? (
              <div className="flex items-center justify-center p-6 text-center bg-background">
                <h2 className="font-headline text-2xl font-bold text-foreground">
                  {post.title}
                </h2>
              </div>
            ) : (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.imageHint}
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          {post.category && (
            <Badge variant="secondary" className="mb-2">
              {post.category}
            </Badge>
          )}
          <CardTitle className="font-headline text-lg leading-tight mb-2 group-hover:text-primary">
            {post.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
           <p className="text-xs text-muted-foreground">By {post.author}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
