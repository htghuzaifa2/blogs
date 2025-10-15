
'use client';

import type { Post } from '@/lib/posts';
import { notFound, useSearchParams } from 'next/navigation';
import { PaginatedBlogList } from '@/components/paginated-blog-list';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 50;

// This searchable post is a subset of the full Post type
interface SearchablePost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category?: string; // Make category optional to align with potential search data
}


// This component fetches post data from a static JSON file on the client.
function CategoryClientPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const [allPosts, setAllPosts] = useState<SearchablePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the statically generated post data
    fetch('/search-data.json')
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post data:", err);
        setLoading(false);
      });
  }, []);

  const categorySlug = params.slug;

  const posts: Post[] = useMemo(() => {
    const filtered = allPosts
      .filter(
        (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
      );
    
    // Adapt the SearchablePost to the Post type for the blog card.
    // The missing fields are not used by the card but are required by the type.
    return filtered.map(p => ({
        ...p,
        id: p.slug,
        date: '', // Not available in search data, but not rendered on card
        content: '', 
        htmlContent: '',
        category: p.category || ''
    }));
  }, [allPosts, categorySlug]);

  useEffect(() => {
    // If loading is finished and no posts were found, trigger a 404
    if (!loading && posts.length === 0) {
      notFound();
    }
  }, [loading, posts]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (posts.length === 0) {
    return null; // Let the useEffect handle the notFound() call
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

export default CategoryClientPage;
