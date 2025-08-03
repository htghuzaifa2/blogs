
'use client';

import { useSearchParams } from 'next/navigation';
import { getPosts, Post } from '@/lib/posts';
import { BlogCard } from '@/components/blog-card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Post[]>([]);

  useEffect(() => {
    if (query) {
      const allPosts = getPosts();
      const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredPosts);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight">
            Search Results
          </h1>
          {query ? (
             <p className="mt-2 text-lg text-muted-foreground">
             {results.length} result{results.length !== 1 ? 's' : ''} found for &quot;{query}&quot;
           </p>
          ) : (
            <p className="mt-2 text-lg text-muted-foreground">
              Please enter a search term to see results.
            </p>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {results.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          query && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-headline">No results found</h2>
              <p className="text-muted-foreground mt-2">
                We couldn&apos;t find any posts matching your search.
              </p>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
