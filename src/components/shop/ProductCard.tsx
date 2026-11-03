import { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const handleAdd = () => {
    addItem(product.id);
    setJustAdded(true);
  };

  return (
    <article className="liquid-card group flex flex-col rounded-3xl border border-ink-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name}`}
        className="relative z-10 block overflow-hidden rounded-2xl bg-ink-50 text-left"
      >
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-800 shadow-sm">
            {product.badge}
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 font-display text-2xl font-semibold text-ink-700 backdrop-blur-[2px]">
            Sold out
          </span>
        )}
      </button>

      <div className="relative z-10 mt-5 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{product.category}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-ink-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="font-display text-3xl font-semibold text-ink-900">{formatPrice(product.price_cents, 'USD', false)}</span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className={`liquid-fill inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500 ${
              justAdded ? 'bg-gold-400 text-ink-900' : 'bg-ink-900 text-white'
            }`}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {justAdded ? 'Added' : 'Add to cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
