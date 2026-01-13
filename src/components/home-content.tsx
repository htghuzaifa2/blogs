'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryCarousel } from '@/components/category-carousel';
import { ShoppingBag, User } from 'lucide-react';

import { getSearchData } from '@/lib/cache';

const POSTS_PER_PAGE = 50;

// The search data will only contain the fields needed for the card and searching.
interface SearchablePost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  htmlContent: string;
}

export function HomeContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';

  const [searchIndex, setSearchIndex] = useState<SearchablePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSearchData()
      .then((data) => {
        setSearchIndex(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load search data:", err);
        setError(err.message || "An unexpected error occurred while fetching posts.");
        setLoading(false);
      });
  }, []);

  const allPosts: Post[] = useMemo(() => {
    if (loading || searchIndex.length === 0) {
      return [];
    }
    // Adapt the SearchablePost to the Post type for the blog card.
    return searchIndex.map(p => ({
      ...p,
      id: p.slug,
      date: new Date().toISOString(), // Not available, provide a fallback
      content: '',
    }));
  }, [searchIndex, loading]);

  const categories = Array.from(new Set(allPosts.map(post => post.category).filter(Boolean)));

  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
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
            <Link href="https://htg.huzi.pk/" target="_blank" rel="noopener noreferrer">
              <User className="mr-2 h-5 w-5" />
              Meet The Creator
            </Link>
          </Button>
        </div>
      </div>

      {categories.length > 0 && <CategoryCarousel categories={categories} />}

      <h2 className="text-3xl font-headline font-bold text-center mt-16 mb-8">All Posts</h2>

      {paginatedPosts.length > 0 ? (
        <PaginatedBlogList
          posts={paginatedPosts}
          totalPages={totalPages}
          currentPage={currentPage}
          baseUrl={`/`}
        />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline">No posts found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't find any posts. Please try again later.
          </p>
        </div>
      )}
    </>
  );
}

export function HomeSkeleton() {
  return (
    <>
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-2/3 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>

      <div className="mb-12">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-28 w-28 rounded-full hidden sm:block" />
          <Skeleton className="h-28 w-28 rounded-full hidden md:block" />
        </div>
      </div>

      <Skeleton className="h-9 w-40 mx-auto mt-16 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i - 2} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
