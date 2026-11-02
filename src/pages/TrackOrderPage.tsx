import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, Check, PackageSearch, Search } from 'lucide-react';
import { LiquidWave } from '@/components/ui/LiquidWave';
import { Reveal } from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';
import { formatDateTime, formatPrice } from '@/lib/format';
import { getPaymentLabel, getStatusIndex, ORDER_STATUS_STEPS, type TrackedOrder } from '@/lib/types';

type LookupState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; order: TrackedOrder }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string };

function isTrackedOrder(value: unknown): value is TrackedOrder {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Partial<TrackedOrder>;
  return typeof row.tracking_code === 'string' && typeof row.status === 'string' && Array.isArray(row.items);
}

export function TrackOrderPage() {
  const { code: routeCode } = useParams();
  const [code, setCode] = useState(routeCode ?? '');
  const [lookup, setLookup] = useState<LookupState>({ kind: 'idle' });

  const runLookup = async (rawCode: string) => {
    const trimmed = rawCode.trim().toUpperCase();
    if (!trimmed) return;
    setLookup({ kind: 'loading' });
    const { data, error } = await supabase.rpc('track_order', { p_code: trimmed });
    if (error) {
      setLookup({ kind: 'error', message: 'We could not load this order right now. Please try again.' });
      return;
    }
    if (data === null) {
      setLookup({ kind: 'not_found' });
      return;
    }
    if (!isTrackedOrder(data)) {
      setLookup({ kind: 'error', message: 'We received an unexpected response. Please try again.' });
      return;
    }
    setLookup({ kind: 'found', order: data });
  };

  useEffect(() => {
    if (routeCode) {
      setCode(routeCode);
      void runLookup(routeCode);
    }
  }, [routeCode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runLookup(code);
  };

  const currentIndex = lookup.kind === 'found' ? getStatusIndex(lookup.order.status) : -1;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-gold-50 via-white to-white">
        <div className="liquid-blob -left-24 top-10 h-96 w-96 bg-gold-200/60" />
        <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pt-28">
          <Reveal>
            <p className="eyebrow">Track Order</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.1] sm:text-6xl">
              Follow your <span className="text-gold-shimmer">shipment</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
              Enter the tracking code from your order confirmation to see where your goods are.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={handleSubmit} className="mx-auto mt-12 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  id="tracking-code"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="GIT-XXXXXXXXXX"
                  aria-label="Tracking code"
                  required
                  className="field rounded-full py-3.5 pl-12 uppercase tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={lookup.kind === 'loading'}
                className="liquid-fill rounded-full bg-ink-900 px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                <span className="relative z-10">{lookup.kind === 'loading' ? 'Searching...' : 'Track order'}</span>
              </button>
            </form>
          </Reveal>
        </div>
        <LiquidWave gradientId="track-wave" className="bottom-0 h-20" />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 pt-6 sm:px-8">
        {lookup.kind === 'error' && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-crimson-50 bg-crimson-50 p-8 text-center">
            <AlertTriangle className="h-7 w-7 text-crimson-600" />
            <p className="text-crimson-700">{lookup.message}</p>
          </div>
        )}

        {lookup.kind === 'not_found' && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-ink-100 bg-white p-10 text-center shadow-sm">
            <PackageSearch className="h-8 w-8 text-gold-600" />
            <p className="font-display text-2xl font-semibold text-ink-900">No order found</p>
            <p className="text-ink-500">Check the tracking code and try again.</p>
          </div>
        )}

        {lookup.kind === 'found' && (
          <Reveal>
            <div className="space-y-8 rounded-[2rem] border border-gold-100 bg-white p-8 shadow-gold sm:p-10">
              <div className="flex flex-col gap-4 border-b border-ink-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">Tracking code</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-ink-900">{lookup.order.tracking_code}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-ink-500">Placed {formatDateTime(lookup.order.created_at)}</p>
                  <p className="mt-1 font-semibold text-ink-900">
                    {formatPrice(lookup.order.total_cents, lookup.order.currency)}
                  </p>
                </div>
              </div>

              <ol className="space-y-6">
                {ORDER_STATUS_STEPS.map((step, index) => {
                  const done = index <= currentIndex;
                  const current = index === currentIndex;
                  return (
                    <li key={step.id} className="flex gap-4">
                      <span
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          done ? 'border-gold-500 bg-gold-400 text-ink-900' : 'border-ink-200 bg-white text-ink-400'
                        } ${current ? 'animate-pulse-ring' : ''}`}
                      >
                        {done ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">{index + 1}</span>}
                      </span>
                      <div>
                        <p className={`font-semibold ${done ? 'text-ink-900' : 'text-ink-400'}`}>{step.label}</p>
                        <p className={`text-sm ${done ? 'text-ink-600' : 'text-ink-400'}`}>{step.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="grid gap-4 rounded-2xl bg-gold-50/60 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Destination</p>
                  <p className="mt-1 text-ink-900">
                    {[lookup.order.city, lookup.order.country].filter(Boolean).join(', ') || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Payment</p>
                  <p className="mt-1 text-ink-900">
                    {getPaymentLabel(lookup.order.payment_method)}, {lookup.order.payment_status.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Items</p>
                <ul className="mt-3 divide-y divide-ink-100">
                  {lookup.order.items.map((item, index) => (
                    <li key={`${item.name}-${index}`} className="flex justify-between py-3 text-ink-700">
                      <span>{item.name}</span>
                      <span className="text-ink-500">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
}
