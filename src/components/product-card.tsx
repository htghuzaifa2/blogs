
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

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
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-3 space-y-2 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors h-10">
            {product.title}
          </h3>
          <div className="flex justify-between items-center mt-auto pt-2">
            <p className="text-base font-bold text-primary">PKR {product.price}</p>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
               <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
