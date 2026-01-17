import { Suspense } from 'react';
import { SearchResultsContent, SearchSkeleton } from '@/components/search-results-content';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Search Tech Articles & Guides | Huzi Blogs',
  description: 'Easily find tutorials and insights on AI, modern coding techniques, and digital growth within the Huzi Blogs archive.',
};

export default function SearchPage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
