
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 border-border hover:border-primary">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
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
