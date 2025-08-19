
import { getPosts, Post } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PaginatedBlogList } from '@/components/paginated-blog-list';

// This function now fetches data from the API endpoint
async function fetchPosts(): Promise<Post[]> {
  // Construct a base URL that works in both server and client environments
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const response = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = await fetchPosts();
  const categorySlug = params.slug;

  const posts = allPosts
    .filter(
      (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (posts.length === 0) {
    notFound();
  }

  const categoryName = posts[0].category;

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
            Category: {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found in this category.
          </p>
        </div>

        <PaginatedBlogList posts={posts} />
        
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // We use the original getPosts here because generateMetadata runs only at build time on the server.
  const allPosts = getPosts();
  const categorySlug = params.slug;

  const posts = allPosts.filter(
    (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (posts.length === 0) {
    return {
      title: 'Category Not Found'
    }
  }

  const categoryName = posts[0].category;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/category/${categorySlug}`;
  const description = `Browse all posts in the ${categoryName} category on blogs.huzi.pk.`;
  const title = `${categoryName} Category`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  }
}

export async function generateStaticParams() {
  const posts = getPosts();
  const categories = new Set(posts.map(post => post.category).filter(Boolean));
  
  return Array.from(categories).map(category => ({
    slug: category!.toLowerCase().replace(/ /g, '-')
  }));
}
