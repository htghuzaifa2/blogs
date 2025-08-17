
"use client";

import { useState } from 'react';
import { Post } from '@/lib/posts';
import { BlogCard } from './blog-card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CARDS_PER_PAGE = 20;

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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (currentPage - halfPagesToShow < 1) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfPagesToShow > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
        pageNumbers.push(<Button key="1" variant="outline" size="icon" onClick={() => handlePageChange(1)}>1</Button>);
        if (startPage > 2) {
            pageNumbers.push(<span key="start-ellipsis" className="px-2 py-1">...</span>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? 'default' : 'outline'}
          size="icon"
          className="h-9 w-9"
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
             pageNumbers.push(<span key="end-ellipsis" className="px-2 py-1">...</span>);
        }
        pageNumbers.push(<Button key={totalPages} variant="outline" size="icon" onClick={() => handlePageChange(totalPages)}>{totalPages}</Button>);
    }


    return pageNumbers;
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {currentPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="icon"
            aria-label="Go to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {renderPageNumbers()}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="icon"
            aria-label="Go to next page"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
