
import type { Post } from '@/lib/posts';
import { getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { PaginatedBlogList } from '@/components/paginated-blog-list';

export const runtime = 'edge';

const POSTS_PER_PAGE = 50;

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: { slug: string };
  searchParams?: { page?: string };
}) {
  const allPosts = getPosts();
  const categorySlug = params.slug;

  const posts = allPosts.filter(
    (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;
  const currentPage = Number(searchParams?.page || '1');
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Category: {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found in the "{categoryName}" category.
          </p>
        </div>

        <PaginatedBlogList 
            posts={paginatedPosts} 
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/category/${categorySlug}`}
        />
        
      </main>
    </div>
  );
}
