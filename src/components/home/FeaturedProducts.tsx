import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductDetailModal } from '@/components/shop/ProductDetailModal';
import { Reveal } from '@/components/ui/Reveal';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/types';

export function FeaturedProducts() {
  const { products, loading, error, reload } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featured = [...products]
    .sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
    .slice(0, 4);

  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">From the Shop</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Goods chosen for quality</h2>
            <p className="mt-4 text-lg text-ink-600">
              A glimpse of our curated range: electronics, tea and ceramics, fabrics, tools and more.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-gold-400 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-50 md:self-auto"
          >
            View the full shop
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-14">
          {error && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-crimson-50 bg-crimson-50 p-8 text-center">
              <AlertTriangle className="h-7 w-7 text-crimson-600" />
              <p className="text-crimson-700">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((key) => (
                <div key={key} className="space-y-4 rounded-3xl border border-ink-100 p-4">
                  <div className="skeleton aspect-[4/3] rounded-2xl" />
                  <div className="skeleton h-6 w-2/3 rounded-full" />
                  <div className="skeleton h-4 w-1/2 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!error && !loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard product={product} onOpen={setSelectedProduct} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
