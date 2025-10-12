
'use client';

import { Suspense, useState, useEffect } from 'react';
import type { Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

// A trimmed-down version of the Post type for search results
interface SearchablePost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string; // The raw content for searching
  // These fields are needed for the BlogCard
  id: string;
  imageUrl: string;
  imageHint: string;
  author: string;
  date: string;
  htmlContent: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchIndex, setSearchIndex] = useState<SearchablePost[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(true);

  useEffect(() => {
    fetch('/search-data.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: SearchablePost[]) => {
        setSearchIndex(data);
        setLoadingIndex(false);
      })
      .catch(err => {
          console.error("Failed to load search data:", err);
          setLoadingIndex(false);
      });
  }, []);

  if (loadingIndex) {
      return <SearchSkeleton />;
  }

  if (!query) {
    return (
      <div className="text-center py-16">
         <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight break-words px-4">
          Search Results
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Please enter a search term to see results.
        </p>
      </div>
    );
  }

  const lowercasedQuery = query.toLowerCase();

  const results = searchIndex
    .map(post => {
      const title = post.title.toLowerCase();
      const excerpt = post.excerpt.toLowerCase();
      const category = post.category.toLowerCase();
      
      let relevance = 0;

      // 1. Exact match at the start of the title (highest priority)
      if (title.startsWith(lowercasedQuery)) {
        relevance += 100;
      }

      // 2. All query words in the title
      const queryWords = lowercasedQuery.split(' ').filter(w => w);
      const titleWords = title.split(' ');
      let matches = 0;
      queryWords.forEach(word => {
        if (title.includes(word)) {
          matches++;
        }
      });
      if (matches > 0) {
        relevance += matches * 20;
      }
      
      // 3. Full phrase match in excerpt
       if (excerpt.includes(lowercasedQuery)) {
        relevance += 15;
      }

      // 4. Any query word in excerpt
      queryWords.forEach(word => {
        if (excerpt.includes(word)) {
          relevance += 5;
        }
      });
      
      // 5. Match the category
      if (category.includes(lowercasedQuery)) {
        relevance += 10;
      }
      
      return { ...post, relevance };
    })
    .filter(post => post.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);

  // The searchIndex already contains all the data needed for the Post type.
  const finalResults: Post[] = results;

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight break-words px-4">
          Search Results
        </h1>
        <p className="mt-2 text-lg text-muted-foreground break-words px-4">
          {finalResults.length} result{finalResults.length !== 1 ? 's' : ''} found for &quot;{query}&quot;
        </p>
      </div>

      {finalResults.length > 0 ? (
         <PaginatedBlogList posts={finalResults} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-headline">No results found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn&apos;t find any posts matching your search. Try a different query.
          </p>
        </div>
      )}
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

export default function SearchPage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
