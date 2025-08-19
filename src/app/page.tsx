
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryCarousel } from '@/components/category-carousel';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import type { Post } from '@/lib/posts';
import { ShoppingBag, User } from 'lucide-react';

// This function now fetches data from the API endpoint
async function fetchPosts(): Promise<Post[]> {
  // Construct a base URL that works in both server and client environments
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const response = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' });
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}


export default async function Home() {
  const posts = await fetchPosts();
  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
  
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Welcome to blogs.huzi.pk
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A collection of thoughts, stories, and ideas.
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
