"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm h-full flex flex-col">
      <Link href={`https://huzi.pk/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
        {/* Image container with a fixed aspect ratio */}
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Content section */}
        <CardContent className="p-3 space-y-1 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-grow">
            {product.title}
          </h3>
          <p className="text-base font-bold text-primary pt-1">PKR {product.price}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
