import { Suspense } from 'react';
import { BlogArchiveContent, BlogArchiveSkeleton } from '@/components/blog-archive-content';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'All Posts - Huzi Blogs',
  description: 'Browse our complete collection of articles. From deep dives into Artificial Intelligence and Web Development to practical Lifestyle advice and Tech reviews.',
};

export default function BlogArchivePage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<BlogArchiveSkeleton />}>
          <BlogArchiveContent />
        </Suspense>
      </main>
    </div>
  );
}
