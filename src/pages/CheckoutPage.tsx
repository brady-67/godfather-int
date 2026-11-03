import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CreditCard, Smartphone, ShoppingBag, Wallet, MessageCircle } from 'lucide-react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Reveal } from '@/components/ui/Reveal';
import { TextField } from '@/components/ui/TextField';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useCart } from '@/contexts/CartContext';
import { COMPANY, whatsappLink } from '@/lib/company';
import { formatPrice } from '@/lib/format';
import { PAYMENT_METHODS, type ShippingDetails } from '@/lib/types';

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

const PAYMENT_ICONS = {
  wechat_pay: MessageCircle,
  alipay: Smartphone,
  paypal: Wallet,
  international_card: CreditCard,
} as const;

export function CheckoutPage() {
  const { items, subtotalCents, itemCount, setQuantity, removeItem, catalogLoading, catalogError } = useCart();
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);

  const updateField = (field: keyof ShippingDetails) => (value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;

    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} x ${item.quantity} - ${formatPrice(item.lineTotalCents)}`,
    );
    const address = [shipping.address_line, shipping.city, shipping.postal_code, shipping.country]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', ');

    const message = [
      `Hello ${COMPANY.name}, I would like to place an order.`,
      '',
      '*Order*',
      ...lines,
      '',
      `*Total:* ${formatPrice(subtotalCents)}`,
      '',
      '*Delivery details*',
      `Name: ${shipping.name.trim()}`,
      `Email: ${shipping.email.trim()}`,
      `Phone: ${shipping.phone.trim()}`,
      `Address: ${address}`,
      ...(shipping.notes.trim() ? [`Notes: ${shipping.notes.trim()}`] : []),
      '',
      'Please confirm availability and how to pay. Thank you!',
    ].join('\n');

    const url = whatsappLink(message);
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.href = url;
  };

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
          <p className="eyebrow">Checkout</p>
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
                <TextField id="ship-phone" label="Phone / WhatsApp number" type="tel" value={shipping.phone} onChange={updateField('phone')} autoComplete="tel" required />
                <TextField id="ship-country" label="Country" value={shipping.country} onChange={updateField('country')} autoComplete="country-name" required />
                <TextField id="ship-city" label="City" value={shipping.city} onChange={updateField('city')} autoComplete="address-level2" required />
                <TextField id="ship-postal" label="Postal code" value={shipping.postal_code} onChange={updateField('postal_code')} autoComplete="postal-code" required />
              </div>
              <TextField id="ship-address" label="Street address" value={shipping.address_line} onChange={updateField('address_line')} autoComplete="street-address" required />
              <TextField id="ship-notes" label="Order notes" value={shipping.notes} onChange={updateField('notes')} rows={3} placeholder="Optional delivery instructions" />
            </fieldset>

            <fieldset className="space-y-5 rounded-[2rem] border border-gold-100 bg-white p-7 shadow-sm sm:p-8">
              <legend className="font-display text-2xl font-semibold text-ink-900">Payment method</legend>
              <p className="text-sm text-ink-500">
                Online payments are launching soon. For now, send your order on WhatsApp and we will confirm everything and
                share payment details with you.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = PAYMENT_ICONS[method.id];
                  return (
                    <div
                      key={method.id}
                      aria-disabled="true"
                      className="coming-soon-card cursor-not-allowed rounded-2xl border-2 border-dashed border-gold-300 bg-gradient-to-br from-gold-50 via-white to-gold-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gold-700 shadow-sm ring-1 ring-gold-200">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-gold-400" />
                          </span>
                          Coming soon
                        </span>
                      </div>
                      <p className="mt-4 font-semibold text-ink-700">{method.label}</p>
                      <p className="mt-1 text-sm text-ink-400">{method.hint}</p>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={items.length === 0}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-95 disabled:opacity-60"
              >
                <WhatsAppIcon className="h-6 w-6" />
                Order on WhatsApp - {formatPrice(subtotalCents)}
              </button>
              <p className="text-center text-xs text-ink-400">
                This opens WhatsApp with your order and delivery details ready to send.
              </p>
            </div>
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
