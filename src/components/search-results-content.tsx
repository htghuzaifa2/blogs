'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import type { Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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

export function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
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
                    throw new Error(`Search service is unavailable (HTTP ${res.status}). Please try again later.`);
                }
                return res.json();
            })
            .then((data: SearchablePost[]) => {
                setSearchIndex(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load search data:", err);
                setError(err.message || "An unexpected error occurred while fetching search results.");
                setLoading(false);
            });
    }, []);

    const results: Post[] = useMemo(() => {
        if (loading || !query || searchIndex.length === 0) {
            return [];
        }

        const lowercasedQuery = query.toLowerCase().trim();
        if (!lowercasedQuery) return [];

        const calculatedResults = searchIndex
            .map(post => {
                const title = post.title.toLowerCase();
                const excerpt = post.excerpt.toLowerCase();

                let relevance = 0;

                // Highest priority: query is a substring of the title
                if (title.includes(lowercasedQuery)) {
                    relevance += 50;
                }

                // High priority: Exact match at the start of the title
                if (title.startsWith(lowercasedQuery)) {
                    relevance += 50;
                }

                // Medium priority: query is a substring of the excerpt
                if (excerpt.includes(lowercasedQuery)) {
                    relevance += 20;
                }

                // Lower priority: individual words from query match in title
                const queryWords = lowercasedQuery.split(' ').filter(w => w.length > 2);
                if (queryWords.length > 1) {
                    queryWords.forEach(word => {
                        if (title.includes(word)) {
                            relevance += 10;
                        }
                        if (excerpt.includes(word)) {
                            relevance += 2;
                        }
                    });
                }

                return { ...post, relevance };
            })
            .filter(post => post.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        // Adapt the SearchablePost to the Post type for the blog card.
        const finalResults: Post[] = calculatedResults.map(r => ({
            ...r,
            id: r.slug,
            date: new Date().toISOString(), // Not available, provide a fallback
            content: '',
        }));

        return finalResults;
    }, [query, searchIndex, loading]);

    const currentPage = Number(page) || 1;
    const totalPages = Math.ceil(results.length / POSTS_PER_PAGE);

    const paginatedResults = results.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

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
                <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight break-words px-4">
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

            {paginatedResults.length > 0 ? (
                <PaginatedBlogList
                    posts={paginatedResults}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    baseUrl={`/search?q=${encodeURIComponent(query)}`}
                />
            ) : query && (
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

export function SearchSkeleton() {
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
