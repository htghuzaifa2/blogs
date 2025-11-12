
'use client';

import type { Post } from '@/lib/posts';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const runtime = 'edge';

const POSTS_PER_PAGE = 50;

interface SearchablePost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  htmlContent: string;
}

function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  
  const [searchIndex, setSearchIndex] = useState<SearchablePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/search-data.json')
      .then(res => {
        if (!res.ok) {
           throw new Error(`The content service is unavailable (HTTP ${res.status}). Please try again later.`);
        }
        return res.json();
      })
      .then((data: SearchablePost[]) => {
        setSearchIndex(data);
        setLoading(false);
      })
      .catch(err => {
          console.error("Failed to load search data for category:", err);
          setError(err.message || "An unexpected error occurred while fetching category content.");
          setLoading(false);
      });
  }, []);
  
  const filteredPosts: Post[] = useMemo(() => {
    if (loading || !categorySlug || searchIndex.length === 0) {
      return [];
    }

    const postsInCategory = searchIndex.filter(
      (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
    );
    
    // Adapt SearchablePost to Post type for the blog card.
    return postsInCategory.map(p => ({
        ...p,
        id: p.slug,
        date: new Date().toISOString(), // Not available, provide a fallback
        content: '', 
    }));

  }, [categorySlug, searchIndex, loading]);

  const categoryName = useMemo(() => {
      if (filteredPosts.length > 0) {
        // Since all posts here are from the same category, we can take the name from the first one.
        return filteredPosts[0].category;
      }
      // If no posts are found yet, try to derive from slug until data loads.
      return categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [filteredPosts, categorySlug]);


  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    if (!loading && filteredPosts.length === 0 && searchIndex.length > 0) {
      // Trigger a 404 if the category has no posts after loading and search index is available
      notFound();
    }
  }, [loading, filteredPosts, searchIndex]);


  if (loading) {
    return <SearchSkeleton />;
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
          Category: {categoryName}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found in the "{categoryName}" category.
        </p>
      </div>

      <PaginatedBlogList
        posts={paginatedPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/category/${categorySlug}`}
      />
    </>
  );
}

function SearchSkeleton() {
  return (
    <>
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-2/3 mx-auto" />
        <Skeleton className="h-6 w-1/3 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
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


export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchSkeleton />}>
          <CategoryContent categorySlug={params.slug} />
        </Suspense>
      </main>
    </div>
  );
}
