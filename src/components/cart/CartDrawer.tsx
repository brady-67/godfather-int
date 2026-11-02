import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotalCents, itemCount, setQuantity, removeItem, catalogLoading, catalogError, reloadCatalog } =
    useCart();

  return (
    <Dialog open={isOpen} onClose={closeCart} title={`Your cart (${itemCount})`} align="right">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {catalogError && (
          <div className="mb-4 rounded-2xl border border-crimson-50 bg-crimson-50 p-4 text-sm text-crimson-700">
            <p>{catalogError}</p>
            <button type="button" onClick={() => void reloadCatalog()} className="mt-2 font-semibold underline">
              Try again
            </button>
          </div>
        )}

        {!catalogError && catalogLoading && items.length === 0 && (
          <div className="space-y-4">
            {[0, 1].map((key) => (
              <div key={key} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        )}

        {items.length === 0 && !catalogLoading && !catalogError && (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-700">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <p className="font-display text-2xl font-semibold text-ink-900">Your cart is empty</p>
            <p className="max-w-xs text-sm text-ink-500">Discover quality goods from our curated shop.</p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-900"
            >
              Browse the shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <ul className="space-y-4">
          {items.map(({ product, quantity, lineTotalCents }) => (
            <li
              key={product.id}
              className="animate-fade-in flex gap-4 rounded-2xl border border-ink-100 bg-white p-3 shadow-sm"
            >
              <img src={product.image_url} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500">{formatPrice(product.price_cents)} each</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="rounded-full p-1.5 text-ink-400 transition hover:bg-crimson-50 hover:text-crimson-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <QuantityStepper
                    value={quantity}
                    max={Math.max(1, Math.min(99, product.stock))}
                    onChange={(next) => setQuantity(product.id, next)}
                    label={`Quantity for ${product.name}`}
                  />
                  <span className="text-sm font-semibold text-ink-900">{formatPrice(lineTotalCents)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {items.length > 0 && (
        <footer className="space-y-4 border-t border-ink-100 bg-gold-50/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-600">Subtotal</span>
            <span className="font-display text-2xl font-semibold text-ink-900">{formatPrice(subtotalCents)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={closeCart}
            className="liquid-fill flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow-soft"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </footer>
      )}
    </Dialog>
  );
}
