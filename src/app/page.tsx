import { Suspense } from 'react';
import { HomeContent, HomeSkeleton } from '@/components/home-content';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Huzi Blogs',
  description: 'Discover expert insights on AI, technology, and lifestyle at Huzi Blogs. Your source for coding tutorials, tech trends, and personal growth in Pakistan.',
};

export default function HomePage() {
  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Suspense fallback={<HomeSkeleton />}>
          <HomeContent />
        </Suspense>
      </main>
    </div>
  );
}
