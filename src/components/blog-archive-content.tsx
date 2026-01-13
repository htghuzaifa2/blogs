'use client';

import { useState, useEffect, useMemo } from 'react';
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

export function BlogArchiveContent() {
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
                    throw new Error(`Content service is unavailable (HTTP ${res.status}). Please try again later.`);
                }
                return res.json();
            })
            .then((data: SearchablePost[]) => {
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

    const currentPage = Number(page) || 1;
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    const paginatedPosts = allPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    if (loading) {
        return <BlogArchiveSkeleton />;
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
                    Blog Archive
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Explore all {allPosts.length} posts from our archive.
                </p>
            </div>

            <PaginatedBlogList
                posts={paginatedPosts}
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/blog"
            />
        </>
    );
}

export function BlogArchiveSkeleton() {
    return (
        <>
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {[...Array(12)].map((_, i) => (
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
