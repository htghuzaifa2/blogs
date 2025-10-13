"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ShoppingCart } from 'lucide-react'
import products from '@/lib/products.json'
import { cn } from '@/lib/utils'

interface Product {
  slug: string
  title: string
  price: string
  imageUrl: string
}

export function ProductPopup() {
  const [product, setProduct] = useState<Product | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('product-popup-dismissed')) {
      setIsDismissed(true)
      return
    }

    const timer = setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setProduct(randomProduct)
      setIsVisible(true)
    }, 5000) // Show after 5 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('product-popup-dismissed', 'true')
  }

  if (!product || isDismissed) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 w-80 transform transition-all duration-500 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <Card className="overflow-hidden shadow-2xl border-primary/20">
        <CardContent className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>

          <div className="flex gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="font-headline text-sm font-semibold line-clamp-2">
                {product.title}
              </h4>
              <p className="text-lg font-bold text-primary">${product.price}</p>
              <Button asChild size="sm" className="mt-2">
                <Link href={`https://huzi.pk/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Product
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
