
"use client";

import { useState } from 'react';
import { Post } from '@/lib/posts';
import { BlogCard } from './blog-card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CARDS_PER_PAGE = 25;

interface PaginatedBlogListProps {
  posts: Post[];
}

export function PaginatedBlogList({ posts }: PaginatedBlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {currentPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="lg"
            aria-label="Go to previous page"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="lg"
            aria-label="Go to next page"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
