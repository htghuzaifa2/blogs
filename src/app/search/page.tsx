
'use client';

import { useSearchParams } from 'next/navigation';
import { getPosts, Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Levenshtein distance function for fuzzy search
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Deletion
        dp[i][j - 1] + 1, // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return dp[m][n];
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setAllPosts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (query && allPosts.length > 0) {
      const lowercasedQuery = query.toLowerCase();

      const filteredPosts = allPosts
        .map(post => {
          const title = post.title.toLowerCase();
          const excerpt = post.excerpt.toLowerCase();
          
          const titleDistance = levenshteinDistance(lowercasedQuery, title);
          const excerptDistance = levenshteinDistance(lowercasedQuery, excerpt);
          
          const distance = Math.min(titleDistance, excerptDistance);
          
          // Direct match in title or excerpt gets highest priority
          if (title.includes(lowercasedQuery) || excerpt.includes(lowercasedQuery)) {
            return { post, relevance: 0 }; 
          }
          
          const threshold = Math.floor(query.length / 2);

          if (distance <= threshold) {
            return { post, relevance: distance };
          }
          
          return null;
        })
        .filter((item): item is { post: Post; relevance: number } => item !== null)
        .sort((a, b) => a.relevance - b.relevance)
        .map(item => item.post);

      setResults(filteredPosts);
    } else {
      setResults([]);
    }
  }, [query, allPosts]);
  
  if (loading) {
    return <SearchSkeleton />;
  }

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight break-words px-4">
          Search Results
        </h1>
        {query ? (
           <p className="mt-2 text-lg text-muted-foreground break-words px-4">
           {results.length} result{results.length !== 1 ? 's' : ''} found for &quot;{query}&quot;
         </p>
        ) : (
          <p className="mt-2 text-lg text-muted-foreground">
            Please enter a search term to see results.
          </p>
        )}
      </div>

      {results.length > 0 ? (
         <PaginatedBlogList posts={results} />
      ) : (
        query && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-headline">No results found</h2>
            <p className="text-muted-foreground mt-2">
              We couldn&apos;t find any posts matching your search. Try a different query.
            </p>
          </div>
        )
      )}
    </>
  )
}

function SearchSkeleton() {
  return (
    <>
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-2/3 mx-auto" />
        <Skeleton className="h-6 w-1/3 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
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
  )
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
