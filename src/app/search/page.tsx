import { Suspense } from 'react';
import { SearchResultsContent, SearchSkeleton } from '@/components/search-results-content';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Search – Blogs.huzi.pk',
  description: 'Search our blog archive for articles on AI, technology, and lifestyle.',
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
