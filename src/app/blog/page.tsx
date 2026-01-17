import { Suspense } from 'react';
import { BlogArchiveContent, BlogArchiveSkeleton } from '@/components/blog-archive-content';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Blog Archive | Comprehensive Tech and Digital Insights - Huzi Blogs',
  description: 'Explore our complete archive of in-depth articles on AI, high-performance programming, and modern digital lifestyle. curated by Huzi for forward-thinking developers and tech enthusiasts.',
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
