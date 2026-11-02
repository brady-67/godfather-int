import { useMemo, useState } from 'react';
import { AlertTriangle, Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductDetailModal } from '@/components/shop/ProductDetailModal';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { useProducts } from '@/hooks/useProducts';
import { countByCategory, type CategoryFilter } from '@/lib/catalog';
import { PRODUCT_CATEGORIES, type Product } from '@/lib/types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A to Z' },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price_cents - b.price_cents);
    case 'price-desc':
      return sorted.sort((a, b) => b.price_cents - a.price_cents);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || a.name.localeCompare(b.name));
  }
}

export function ShopPage() {
  const { products, loading, error, reload } = useProducts();
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const counts = useMemo(() => countByCategory(products), [products]);

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== 'All' && product.category !== category) return false;
      if (!needle) return true;
      return `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(needle);
    });
    return sortProducts(filtered, sort);
  }, [products, category, query, sort]);

  const categoryPills: CategoryFilter[] = ['All', ...PRODUCT_CATEGORIES];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white">
        <div className="liquid-blob -left-24 top-10 h-96 w-96 bg-gold-200/60" />
        <div className="liquid-blob -right-20 top-0 h-[28rem] w-[28rem] bg-gold-300/40" style={{ animationDelay: '-6s' }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-2 lg:pt-20">
          <Reveal>
            <p className="eyebrow">The Shop</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] sm:text-6xl">
              Quality goods, <span className="text-gold-shimmer">ready to ship worldwide</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              A curated selection of physical goods sourced through our global supplier network. Browse by category, check
              live stock, and order with a secure checkout.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
              <div className="gold-ring animate-spin-slow absolute -inset-3 rounded-[2.5rem] opacity-80 blur-[1px]" />
              <div className="absolute inset-0 overflow-hidden rounded-[2.2rem] bg-white p-1.5">
                <img
                  src="https://images.pexels.com/photos/7232404/pexels-photo-7232404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Lustrous gold satin fabric draped in soft folds"
                  className="h-full w-full rounded-[2rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gold-200 bg-white/95 px-5 py-4 shadow-gold backdrop-blur animate-float">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">Catalog</p>
                <p className="font-display text-2xl font-semibold text-ink-900">
                  {loading ? 'Loading' : `${products.length} products`}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <LiquidWave gradientId="shop-wave" className="bottom-0 h-20" />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 pt-6 sm:px-8">
        <div className="sticky top-20 z-30 -mx-2 space-y-4 rounded-3xl bg-white/90 p-2 backdrop-blur-xl sm:top-24">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="field rounded-full py-3 pl-12"
              />
            </div>

            <label className="relative flex items-center gap-3 self-start text-sm text-ink-600 lg:self-auto">
              <SlidersHorizontal className="h-4 w-4 text-gold-700" />
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="field w-auto rounded-full py-2.5 pr-10"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryPills.map((pill) => {
              const active = category === pill;
              const count = pill === 'All' ? products.length : counts[pill] ?? 0;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setCategory(pill)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ${
                    active
                      ? 'border-ink-900 bg-ink-900 text-white shadow-soft'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-gold-400 hover:text-ink-900'
                  }`}
                >
                  {pill}
                  <span className={`ml-2 text-xs ${active ? 'text-gold-300' : 'text-ink-400'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          {error && (
            <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-crimson-50 bg-crimson-50 p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-crimson-600" />
              <p className="text-crimson-700">{error}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-900"
              >
                Try again
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <div key={key} className="space-y-4 rounded-3xl border border-ink-100 p-4">
                  <div className="skeleton aspect-[4/3] rounded-2xl" />
                  <div className="skeleton h-4 w-1/3 rounded-full" />
                  <div className="skeleton h-7 w-2/3 rounded-full" />
                  <div className="skeleton h-4 w-full rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!error && !loading && visibleProducts.length === 0 && (
            <div className="mx-auto max-w-md py-16 text-center">
              <p className="font-display text-3xl font-semibold text-ink-900">No products match your search</p>
              <p className="mt-3 text-ink-500">Try a different keyword or choose another category.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="mt-6 rounded-full border border-gold-400 px-6 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-50"
              >
                Clear filters
              </button>
            </div>
          )}

          {!error && !loading && visibleProducts.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index, 5) * 60}>
                  <ProductCard product={product} onOpen={setSelectedProduct} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
