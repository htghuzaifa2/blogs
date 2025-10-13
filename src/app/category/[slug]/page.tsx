
import { getPosts, Post } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PaginatedBlogList } from '@/components/paginated-blog-list';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = getPosts();
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
            {posts.length} post{posts.length !== 1 ? 's' : ''} found in the "{categoryName}" category.
          </p>
        </div>

        <PaginatedBlogList posts={posts} />
        
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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
  const title = `Posts in the ${categoryName} Category`;
  const description = `Browse all posts in the ${categoryName} category on blogs.huzi.pk. Explore articles on technology, Linux, and more.`;

  return {
    title: title,
    description: description,
    keywords: [categoryName, 'blog', 'posts', 'articles', 'technology', 'huzi.pk'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: 'website',
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
