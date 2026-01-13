'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Post } from '@/lib/posts';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { useSearchParams } from 'next/navigation';

const POSTS_PER_PAGE = 50;

interface CategoryContentProps {
    categorySlug: string;
    initialPosts: Post[];
    categoryName: string;
}

export function CategoryContent({ categorySlug, initialPosts, categoryName }: CategoryContentProps) {
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || '1';

    // We can just use initialPosts directly since simpler.
    // But if we wanted to support "search" within category later, we might keep state.
    // For now, just use props.

    const currentPage = Number(page) || 1;
    const totalPages = Math.ceil(initialPosts.length / POSTS_PER_PAGE);

    const paginatedPosts = initialPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
                    Category: {categoryName}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    {initialPosts.length} post{initialPosts.length !== 1 ? 's' : ''} found in the "{categoryName}" category.
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
