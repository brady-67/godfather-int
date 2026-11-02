import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Copy, ShoppingBag } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Reveal } from '@/components/ui/Reveal';
import { TextField } from '@/components/ui/TextField';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { PAYMENT_METHODS, type PaymentMethod, type PlacedOrder, type ShippingDetails } from '@/lib/types';

const EMPTY_SHIPPING: ShippingDetails = {
  name: '',
  email: '',
  phone: '',
  address_line: '',
  city: '',
  postal_code: '',
  country: '',
  notes: '',
};

function isPlacedOrder(value: unknown): value is PlacedOrder {
  if (typeof value !== 'object' || value === null) return false;
  const order = value as Partial<PlacedOrder>;
  return typeof order.id === 'string' && typeof order.tracking_code === 'string' && typeof order.total_cents === 'number';
}

export function CheckoutPage() {
  const { items, subtotalCents, itemCount, setQuantity, removeItem, clearCart, catalogLoading, catalogError } = useCart();
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('international_card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof ShippingDetails) => (value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      p_shipping: shipping,
      p_payment_method: paymentMethod,
    });

    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message.includes('stock')
        ? 'Some items no longer have enough stock. Please review your cart.'
        : 'We could not place your order. Please check your details and try again.');
      return;
    }
    if (!isPlacedOrder(data)) {
      setError('We received an unexpected response. Your order may not have been placed; please check your account.');
      return;
    }
    setPlaced(data);
    clearCart();
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (placed) {
    return (
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white px-5 py-24 sm:px-8">
        <div className="liquid-blob -left-24 top-10 h-96 w-96 bg-gold-200/60" />
        <Reveal className="relative mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-400 text-ink-900 shadow-gold animate-scale-in">
            <Check className="h-10 w-10" />
          </span>
          <h1 className="mt-8 text-4xl font-semibold text-ink-900">Thank you, your order is placed</h1>
          <p className="mt-4 text-ink-600">Keep this tracking code to follow your shipment.</p>
          <div className="mt-8 rounded-3xl border border-gold-200 bg-white p-6 shadow-gold">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">Tracking code</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{placed.tracking_code}</p>
            <p className="mt-2 text-sm text-ink-500">Total {formatPrice(placed.total_cents)}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => void handleCopy(placed.tracking_code)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400 px-6 py-3 text-sm font-semibold text-ink-900 transition hover:bg-gold-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy code'}
            </button>
            <Link
              to={`/track/${placed.tracking_code}`}
              className="inline-flex items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-900"
            >
              Track this order
            </Link>
          </div>
        </Reveal>
      </section>
    );
  }

  if (!catalogLoading && items.length === 0) {
    return (
      <section className="mx-auto flex max-w-lg flex-col items-center gap-5 px-5 py-40 text-center sm:px-8">
        <ShoppingBag className="h-12 w-12 text-gold-600" />
        <h1 className="font-display text-4xl font-semibold text-ink-900">Your cart is empty</h1>
        <p className="text-ink-500">Add goods from the shop to begin your checkout.</p>
        <Link
          to="/shop"
          className="mt-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-900"
        >
          Go to the shop
        </Link>
      </section>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gold-50/70 via-white to-white">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 lg:pt-36">
        <Reveal>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">Complete your order</h1>
        </Reveal>

        {catalogError && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-crimson-50 bg-crimson-50 px-5 py-4 text-crimson-700">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>{catalogError}</p>
          </div>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={handleSubmit} className="space-y-10">
            <fieldset className="space-y-5 rounded-[2rem] border border-gold-100 bg-white p-7 shadow-sm sm:p-8">
              <legend className="font-display text-2xl font-semibold text-ink-900">Shipping details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField id="ship-name" label="Full name" value={shipping.name} onChange={updateField('name')} autoComplete="name" required />
                <TextField id="ship-email" label="Email" type="email" value={shipping.email} onChange={updateField('email')} autoComplete="email" required />
                <TextField id="ship-phone" label="Phone" type="tel" value={shipping.phone} onChange={updateField('phone')} autoComplete="tel" required />
                <TextField id="ship-country" label="Country" value={shipping.country} onChange={updateField('country')} autoComplete="country-name" required />
                <TextField id="ship-city" label="City" value={shipping.city} onChange={updateField('city')} autoComplete="address-level2" required />
                <TextField id="ship-postal" label="Postal code" value={shipping.postal_code} onChange={updateField('postal_code')} autoComplete="postal-code" required />
              </div>
              <TextField id="ship-address" label="Street address" value={shipping.address_line} onChange={updateField('address_line')} autoComplete="street-address" required />
              <TextField id="ship-notes" label="Order notes" value={shipping.notes} onChange={updateField('notes')} rows={3} placeholder="Optional delivery instructions" />
            </fieldset>

            <fieldset className="space-y-5 rounded-[2rem] border border-gold-100 bg-white p-7 shadow-sm sm:p-8">
              <legend className="font-display text-2xl font-semibold text-ink-900">Payment method</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      aria-pressed={active}
                      className={`rounded-2xl border-2 p-5 text-left transition duration-300 ${
                        active ? 'border-gold-500 bg-gold-50 shadow-gold' : 'border-ink-100 bg-white hover:border-gold-300'
                      }`}
                    >
                      <p className="font-semibold text-ink-900">{method.label}</p>
                      <p className="mt-1 text-sm text-ink-500">{method.hint}</p>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="rounded-2xl border border-crimson-50 bg-crimson-50 px-5 py-4 text-sm text-crimson-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="liquid-fill w-full rounded-full bg-ink-900 px-8 py-4 text-base font-semibold text-white disabled:opacity-60"
            >
              <span className="relative z-10">
                {submitting ? 'Placing order...' : `Place order - ${formatPrice(subtotalCents)}`}
              </span>
            </button>
          </form>

          <aside className="h-fit space-y-6 rounded-[2rem] border border-gold-200 bg-white p-7 shadow-gold lg:sticky lg:top-32">
            <h2 className="font-display text-2xl font-semibold text-ink-900">Order summary</h2>
            <ul className="divide-y divide-ink-100">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-4">
                  <img src={item.product.image_url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-ink-900">{item.product.name}</p>
                      <p className="text-sm font-semibold text-ink-900">{formatPrice(item.lineTotalCents)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        label={`Quantity for ${item.product.name}`}
                        value={item.quantity}
                        max={Math.max(item.product.stock, 0)}
                        onChange={(next) => setQuantity(item.product.id, next)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs font-semibold text-ink-500 transition hover:text-crimson-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-ink-100 pt-5 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between font-display text-2xl font-semibold text-ink-900">
                <span>Total</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
            </div>
            {catalogLoading && <p className="text-xs text-ink-400">Refreshing live prices...</p>}
          </aside>
        </div>
      </section>
    </div>
  );
}
