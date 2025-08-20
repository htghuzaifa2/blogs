
'use client';

import { Suspense, useState, useEffect } from 'react';
import type { Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

// Levenshtein distance function for fuzzy search
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};

function SearchResultsContent({ query, allPosts }: { query: string, allPosts: Post[] }) {
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

  const results = allPosts
    .map(post => {
      const title = post.title.toLowerCase();
      const excerpt = post.excerpt.toLowerCase();
      
      let relevance = 0;

      if (title.includes(lowercasedQuery)) {
        relevance += 10;
        if (title.startsWith(lowercasedQuery)) {
          relevance += 5;
        }
      }

      if (excerpt.includes(lowercasedQuery)) {
        relevance += 5;
      }
      
      const titleDistance = levenshteinDistance(lowercasedQuery, title);
      const excerptDistance = levenshteinDistance(lowercasedQuery, excerpt);
      const maxLen = Math.max(query.length, title.length, excerpt.length);

      if (titleDistance < query.length / 2) {
          relevance += (maxLen - titleDistance) / maxLen * 2;
      }
      if (excerptDistance < query.length) {
          relevance += (maxLen - excerptDistance) / maxLen;
      }

      return relevance > 0 ? { post, relevance } : null;
    })
    .filter((item): item is { post: Post; relevance: number } => item !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .map(item => item.post);

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight break-words px-4">
          Search Results
        </h1>
        <p className="mt-2 text-lg text-muted-foreground break-words px-4">
          {results.length} result{results.length !== 1 ? 's' : ''} found for &quot;{query}&quot;
        </p>
      </div>

      {results.length > 0 ? (
         <PaginatedBlogList posts={results} />
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

function SearchPageInternal() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    
    // We now fetch the post data on the client side once from a static JSON file
    // that will be created at build time. This avoids any server-side logic on this route.
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('/search-data.json')
        .then(res => res.json())
        .then(data => {
          setAllPosts(data);
          setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load search data:", err);
            setLoading(false);
        });
    }, []);

    if(loading) {
      return <SearchSkeleton />;
    }

    return <SearchResultsContent query={query} allPosts={allPosts} />;
}

export default function SearchPage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchPageInternal />
        </Suspense>
      </main>
    </div>
  );
}
