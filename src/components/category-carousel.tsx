
"use client"

import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Book, Code, Cpu, Database, Shield, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface CategoryCarouselProps {
  categories: string[];
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'default': <Book size={24} />,
  'ai': <Cpu size={24} />,
  'programming': <Code size={24} />,
  'web development': <Code size={24} />,
  'cybersecurity': <Shield size={24} />,
  'technology': <Smartphone size={24} />,
  'database': <Database size={24} />,
};

const getCategoryIcon = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  for (const key in categoryIcons) {
    if (normalizedCategory.includes(key)) {
      return categoryIcons[key];
    }
  }
  return categoryIcons['default'];
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
                <div className="flex flex-col items-center gap-2 text-center w-24">
                    <Button variant="outline" className="w-20 h-20 rounded-full p-0 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:-translate-y-1">
                      {getCategoryIcon(category)}
                    </Button>
                    <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary truncate w-full">
                      {category}
                    </p>
                </div>
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
