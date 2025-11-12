
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryCarousel } from '@/components/category-carousel';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { getPosts } from '@/lib/posts';
import { ShoppingBag, User } from 'lucide-react';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Blogs.huzi.pk – AI, Tech, and Lifestyle Blogs by Huzi',
  description: 'Welcome to blogs.huzi.pk, your source for insightful articles on AI, technology, programming, and lifestyle. Discover tutorials, guides, and trending topics.',
};

const POSTS_PER_PAGE = 50;

export default async function Home({ searchParams }: { searchParams?: { page?: string } }) {
  const allPosts = getPosts();
  const categories = Array.from(new Set(allPosts.map(post => post.category).filter(Boolean)));
  
  const currentPage = Number(searchParams?.page ?? 1);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Welcome to blogs.huzi.pk
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A collection of thoughts, stories, and ideas on AI, tech, and life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-primary/40">
              <Link href="https://huzi.pk/" target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-secondary/40">
              <Link href="https://htghuzaifa.huzi.pk/" target="_blank" rel="noopener noreferrer">
                <User className="mr-2 h-5 w-5" />
                Meet The Creator
              </Link>
            </Button>
          </div>
        </div>
        
        {categories.length > 0 && <CategoryCarousel categories={categories} />}

        <h2 className="text-3xl font-headline font-bold text-center mt-16 mb-12">Latest Posts</h2>
        {paginatedPosts.length > 0 ? (
           <PaginatedBlogList 
              posts={paginatedPosts} 
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/"
           />
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
