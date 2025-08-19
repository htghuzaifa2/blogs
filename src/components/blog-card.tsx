
'use client';

import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:border-primary/50 group-hover:-translate-y-1 border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative w-full aspect-video overflow-hidden">
             <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={post.imageHint}
              />
          </div>
          <div className="p-6 pb-0">
            {post.category && (
              <Badge variant="secondary" className="mb-3 w-fit">
                {post.category}
              </Badge>
            )}
            <CardTitle className="font-headline text-xl leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4 flex-grow">
          <CardDescription className="text-base text-muted-foreground line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-2 flex justify-between items-center text-sm">
           <p className="text-muted-foreground">By {post.author}</p>
           <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span>Read More</span>
             <ArrowRight className="ml-2 h-4 w-4" />
           </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
