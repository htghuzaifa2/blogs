import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogCard } from '@/components/blog-card';
import { getPosts } from '@/lib/posts';

export default function Home() {
  const posts = getPosts();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
            Welcome to Huzi Blogs
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A collection of thoughts, stories, and ideas.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
