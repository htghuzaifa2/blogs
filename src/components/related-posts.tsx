
import type { Post } from '@/lib/posts';
import { BlogCard } from './blog-card';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-8 text-center">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <BlogCard key={`${post.slug}-${index}`} post={post} />
        ))}
      </div>
    </section>
  );
}
