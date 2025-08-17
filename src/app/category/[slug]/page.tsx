import { getPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PaginatedBlogList } from '@/components/paginated-blog-list';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = getPosts();
  const categorySlug = params.slug;

  const categoryPosts = allPosts.filter(
    (post) => post.category && post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  );

  if (categoryPosts.length === 0) {
    notFound();
  }

  const posts = shuffleArray(categoryPosts);
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
