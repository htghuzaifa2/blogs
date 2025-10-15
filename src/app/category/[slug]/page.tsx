
'use client';

import { getPosts, Post } from '@/lib/posts';
import { notFound, useSearchParams } from 'next/navigation';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 50;

// This component fetches all posts once and then filters on the client.
// This is necessary because generateStaticParams can't be used with searchParams
// in a way that allows for static generation of paginated pages.
function CategoryClientPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch this from an API endpoint,
    // but for now, we'll just use the lib function on the client.
    // This is not ideal for performance but resolves the build error.
    // A better long-term solution might involve a dedicated API route.
    setAllPosts(getPosts());
    setLoading(false);
  }, []);

  const categorySlug = params.slug;

  const posts = useMemo(() => {
    return allPosts
      .filter(
        (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allPosts, categorySlug]);

  useEffect(() => {
    if (!loading && posts.length === 0) {
      notFound();
    }
  }, [loading, posts]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (posts.length === 0) {
    // This will be caught by the useEffect above, but as a fallback.
    return null; 
  }
  
  const categoryName = posts[0].category;
  const currentPage = Number(searchParams.get('page') || '1');
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );


  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Category: {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found in the "{categoryName}" category.
          </p>
        </div>

        <PaginatedBlogList 
            posts={paginatedPosts} 
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/category/${categorySlug}`}
        />
        
      </main>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-2/3 mx-auto" />
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
    </div>
  );
}

// The main export needs to be a default export.
export default CategoryClientPage;

// We remove generateMetadata and generateStaticParams as they cannot be reliably used
// in a page that dynamically handles searchParams on the client.
// Metadata should be handled at a higher level or be more generic for these pages.
