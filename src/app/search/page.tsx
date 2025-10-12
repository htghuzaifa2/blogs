
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
  // We'll fetch the full post data for the card from the main post list
  // to avoid duplicating all data in the search index.
}

function SearchResultsContent({ query, allPosts }: { query: string, allPosts: Post[] }) {
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
  
  if (loadingIndex) {
      return <SearchSkeleton />;
  }

  const lowercasedQuery = query.toLowerCase();
  const queryWords = lowercasedQuery.split(' ').filter(w => w);

  const resultsWithRelevance = searchIndex
    .map(item => {
      const title = item.title.toLowerCase();
      const excerpt = item.excerpt.toLowerCase();
      const category = item.category.toLowerCase();
      const content = item.content.toLowerCase();
      
      let relevance = 0;

      // 1. Exact match at the start of the title (highest priority)
      if (title.startsWith(lowercasedQuery)) {
        relevance += 100;
      }

      // 2. Full phrase match anywhere in title
      if (title.includes(lowercasedQuery)) {
        relevance += 50;
      }

      // 3. Any query word in the title
      queryWords.forEach(word => {
        if (title.includes(word)) {
          relevance += 20;
        }
      });
      
      // 4. Full phrase match in excerpt
       if (excerpt.includes(lowercasedQuery)) {
        relevance += 15;
      }

      // 5. Any query word in excerpt
      queryWords.forEach(word => {
        if (excerpt.includes(word)) {
          relevance += 5;
        }
      });

      // 6. Match the category
      if (category.includes(lowercasedQuery)) {
        relevance += 10;
      }

      // 7. Search in the full content (lower priority)
      queryWords.forEach(word => {
        if (content.includes(word)) {
            relevance += 1;
        }
      });

      return relevance > 0 ? { postSlug: item.slug, relevance } : null;
    })
    .filter((item): item is { postSlug: string; relevance: number } => item !== null)
    .sort((a, b) => b.relevance - a.relevance);
    
    // Create a map of all posts by slug for quick lookup
    const postsBySlug = new Map(allPosts.map(p => [p.slug, p]));
    
    // Map the sorted slugs back to the full post objects
    const results = resultsWithRelevance
      .map(item => postsBySlug.get(item.postSlug))
      .filter((p): p is Post => p !== undefined);


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
    
    // The main post list is now fetched once and passed down.
    // The actual search index is fetched inside SearchResultsContent.
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // This is a simplified approach. Ideally, you'd have a more robust
      // way to get all post metadata without fetching the full search index here.
      // But for now, we'll fetch the same data to pass down to the card renderer.
      fetch('/search-data.json')
        .then(res => res.json())
        .then(data => {
          // This is a temporary workaround to map search data to Post data
          // In a real app, you might have a separate, lighter `posts.json`
          const postData: Post[] = data.map((item: any) => ({
            ...item,
            id: item.slug,
            htmlContent: '', // Not needed for the card
            content: '', // Not needed for the card
            author: 'Admin', // Placeholder
            date: new Date().toISOString(), // Placeholder
            imageUrl: 'https://picsum.photos/seed/1/600/400', // Placeholder
            imageHint: '', // Placeholder
          }));
          
          // Let's create a full post list from the same data to render the cards
          setAllPosts(data.map((p: any) => ({...p, id: p.slug})));
          setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load post data for cards:", err);
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
