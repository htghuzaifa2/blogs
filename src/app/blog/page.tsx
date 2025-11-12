
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { getPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Archive – blogs.huzi.pk',
  description: 'Browse all blog posts from our archive. Find articles on AI, technology, programming, lifestyle, and more.',
  alternates: {
    canonical: '/blog',
  }
};

export const revalidate = 3600; // Revalidate every hour
const POSTS_PER_PAGE = 50;

export default function BlogArchivePage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const allPosts = getPosts();
  
  const currentPage = Number(searchParams?.['page'] || '1');
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Blog Archive
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore all {allPosts.length} posts from our archive.
            </p>
        </div>

        <PaginatedBlogList
            posts={paginatedPosts}
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/blog"
        />
      </main>
    </div>
  );
}
