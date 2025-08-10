import { getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { BlogCard } from '@/components/blog-card';
import type { Metadata } from 'next';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = getPosts();
  const categorySlug = params.slug;

  const posts = allPosts.filter(
    (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (posts.length === 0) {
    notFound();
  }
  
  const categoryName = posts[0].category;

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
            Category: {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found in this category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
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
  const url = `/category/${categorySlug}`;
  const description = `Browse all posts in the ${categoryName} category on blogs.huzi.pk.`;

  return {
    title: `${categoryName} Category | blogs.huzi.pk`,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${categoryName} Category`,
      description: description,
      url: url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Category`,
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
