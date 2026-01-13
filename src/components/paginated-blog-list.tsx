
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import { BlogCard } from './blog-card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginatedBlogListProps {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export function PaginatedBlogList({ posts, totalPages, currentPage, baseUrl }: PaginatedBlogListProps) {
  
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };
  
  // Scroll to top on page change
  useEffect(() => {
    // A small delay ensures the content has started rendering before scrolling.
    const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  if (posts.length === 0) {
    return null;
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pageNumbers.push(<Button key="1" variant="outline" size="icon" asChild><Link href={createPageUrl(1)}>1</Link></Button>);
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="icon"
          aria-label={`Go to page ${i}`}
          className={cn(currentPage === i && 'pointer-events-none')}
          asChild
        >
          <Link href={createPageUrl(i)}>{i}</Link>
        </Button>
      );
    }

    if (endPage < totalPages) {
       if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pageNumbers.push(<Button key={totalPages} variant="outline" size="icon" asChild><Link href={createPageUrl(totalPages)}>{totalPages}</Link></Button>);
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-12">
          <Button
            disabled={currentPage === 1}
            variant="outline"
            className="h-10 px-4"
            aria-label="Go to previous page"
            asChild
          >
            <Link href={createPageUrl(currentPage - 1)}>
               <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-center justify-center flex-wrap gap-2">
            {renderPageNumbers()}
          </div>

          <Button
            disabled={currentPage === totalPages}
            variant="outline"
            className="h-10 px-4"
            aria-label="Go to next page"
            asChild
          >
             <Link href={createPageUrl(currentPage + 1)}>
               <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
