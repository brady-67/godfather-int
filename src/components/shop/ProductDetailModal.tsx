import { useState } from 'react';
import { Lock, ShoppingBag } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;
  return <ProductDetailContent key={product.id} product={product} onClose={onClose} />;
}

function ProductDetailContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.max(1, Math.min(99, product.stock));
  const soldOut = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    addItem(product.id, quantity);
    onClose();
    openCart();
  };

  return (
    <Dialog open onClose={onClose} title={product.name}>
      <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-2">
        <div className="relative bg-ink-50">
          <img src={product.image_url} alt={product.name} className="h-full max-h-[420px] w-full object-cover md:max-h-none" />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-800 shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{product.category}</p>
            <p className="mt-3 font-display text-4xl font-semibold text-ink-900">{formatPrice(product.price_cents, 'USD', false)}</p>
          </div>

          <p className="text-base leading-relaxed text-ink-600">{product.description}</p>

          <div className="space-y-2 text-sm">
            {soldOut && <p className="font-semibold text-crimson-600">Currently sold out</p>}
            {lowStock && <p className="font-semibold text-amber-500">Only {product.stock} left in stock</p>}
            {!soldOut && !lowStock && <p className="font-semibold text-emerald-700">In stock and ready to ship</p>}
          </div>

          {!soldOut && (
            <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
              <span className="text-sm font-medium text-ink-700">Quantity</span>
              <QuantityStepper
                value={Math.min(quantity, maxQuantity)}
                max={maxQuantity}
                onChange={setQuantity}
                label={`Quantity for ${product.name}`}
              />
            </div>
          )}

          <div className="mt-auto space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className="liquid-fill flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {soldOut ? 'Unavailable' : 'Add to cart'}
              </span>
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-ink-400">
              <Lock className="h-3.5 w-3.5" />
              Orders are placed through a secure checkout
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
