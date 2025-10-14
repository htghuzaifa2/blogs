
import { ProductCard } from './product-card';

interface Product {
  id: number;
  slug: string;
  title: string;
  price: string;
  imageUrl: string;
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-8 text-center">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
