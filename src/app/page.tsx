import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { getPosts } from '@/lib/posts';

export default function Home() {
  const posts = getPosts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
            Welcome to blogs.huzi.pk
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A collection of thoughts, stories, and ideas.
          </p>
        </div>

        {posts.length > 0 ? (
           <PaginatedBlogList posts={posts} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-headline">No posts yet</h2>
            <p className="text-muted-foreground mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
