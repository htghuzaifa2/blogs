
"use client"

import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from './ui/button';

interface CategoryCarouselProps {
  categories: string[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  return (
    <div className="mb-12">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => (
            <CarouselItem key={index} className="basis-auto pl-2 md:pl-4 group">
               <Link href={`/category/${category.toLowerCase().replace(/ /g, '-')}`}>
                <Button 
                  variant="outline" 
                  className="w-28 h-28 rounded-full flex items-center justify-center text-center p-2 transition-all duration-300 ease-in-out group-hover:border-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:-translate-y-1 font-medium break-words leading-tight"
                >
                  <span className="truncate-2-lines">{category}</span>
                </Button>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}

// Add this CSS to globals.css to handle multi-line truncation if it doesn't exist
/*
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
}
*/
