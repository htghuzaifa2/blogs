
'use client';

import { notFound, useParams } from 'next/navigation';
import { Suspense, useState, useEffect, useMemo } from 'react';
import type { Post } from '@/lib/posts';
import products from '@/lib/products.json';
import { PostClientWrapper } from '@/components/post-client-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface SearchablePost extends Post {
  htmlContent: string;
}

function getRandomProducts(allProducts: Product[], count: number, excludeSlug?: string): Product[] {
  const shuffled = [...allProducts]
    .filter(p => p.slug !== excludeSlug)
    .sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function PostPageContent() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<SearchablePost | null | undefined>(undefined);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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
            const foundPost = data.find(p => p.slug === slug);
            
            if (foundPost) {
                setPost(foundPost);

                // Calculate related posts
                const sameCategoryPosts = data
                    .filter(p => p.category === foundPost.category && p.slug !== foundPost.slug)
                    .slice(0, 3);
                
                const selectedSlugs = new Set([foundPost.slug, ...sameCategoryPosts.map(p => p.slug)]);
                
                const otherPosts = data.filter(p => !selectedSlugs.has(p.slug));
                const shuffledOthers = otherPosts.sort(() => 0.5 - Math.random());
                
                const randomPosts = shuffledOthers.slice(0, 6 - sameCategoryPosts.length);

                setRelatedPosts([...sameCategoryPosts, ...randomPosts]);

                // Set related products
                setRelatedProducts(getRandomProducts(products, 5));
            } else {
                setPost(null);
            }
            setLoading(false);
          })
          .catch(err => {
              console.error("Failed to load search data for post:", err);
              setError(err.message || "An unexpected error occurred while fetching post content.");
              setLoading(false);
          });
    }, [slug]);

    if (loading) {
        return <PostPageSkeleton />;
    }

    if (error) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </main>
        );
    }

    if (post === null) {
        notFound();
    }
    
    // This check is for TypeScript to know that post is not undefined.
    if (!post) {
      return null;
    }

    return (
        <PostClientWrapper 
            post={post}
            relatedPosts={relatedPosts}
            relatedProducts={relatedProducts}
        />
    );
}

function PostPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-2" />
      <Skeleton className="h-10 md:h-12 w-full mb-4" />
      <Skeleton className="h-5 w-1/2 mb-8" />
      
      <div className="space-y-4 mt-8">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  )
}

export default function PostPage() {
    return (
      <Suspense fallback={<PostPageSkeleton />}>
        <PostPageContent />
      </Suspense>
    )
}
