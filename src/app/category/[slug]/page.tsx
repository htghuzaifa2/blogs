import { Suspense } from 'react';
import { getPosts, Post } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { CategoryContent } from '@/components/category-content';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';

// Remove runtime = 'edge' to allow Node.js fs usage in getPosts
// export const runtime = 'edge'; 

export async function generateStaticParams() {
  const posts = getPosts();
  const categories = new Set(posts.map((post) => post.category.toLowerCase().replace(/ /g, '-')));

  return Array.from(categories).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = getPosts();
  const categorySlug = params.slug;
  const categoryPosts = posts.filter(
    (post) => post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  const categoryName = categoryPosts.length > 0
    ? categoryPosts[0].category
    : categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${categoryName} Insights - Huzi Blogs`,
    description: `Explore our latest articles and tutorials on ${categoryName}. In-depth analysis, guides, and news curated for ${categoryName} enthusiasts.`,
  };
}

function CategorySkeleton() {
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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = getPosts();
  const categorySlug = params.slug;
  const categoryPosts = posts.filter(
    (post) => post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (categoryPosts.length === 0) {
    notFound();
  }

  const categoryName = categoryPosts[0].category;

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryContent
            categorySlug={categorySlug}
            initialPosts={categoryPosts}
            categoryName={categoryName}
          />
        </Suspense>
      </main>
    </div>
  );
}
