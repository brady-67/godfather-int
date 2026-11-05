import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, LogOut, PackageOpen } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatDateTime, formatPrice } from '@/lib/format';
import { getPaymentLabel, getStatusIndex, ORDER_STATUS_STEPS, type OrderRow } from '@/lib/types';
import { usePageMeta } from '@/hooks/usePageMeta';

const ORDERS_QUERY = 'id, tracking_code, status, payment_method, payment_status, total_cents, currency, created_at, updated_at, order_items(id, product_name, unit_price_cents, quantity)';

type OrdersState =
  | { kind: 'loading' }
  | { kind: 'ready'; orders: OrderRow[] }
  | { kind: 'error' };

function isOrderRowArray(value: unknown): value is OrderRow[] {
  return Array.isArray(value) && value.every((row) => typeof row === 'object' && row !== null && 'tracking_code' in row);
}

export function AccountPage() {
  usePageMeta({ title: 'My Orders', description: 'Your orders and tracking details.', noindex: true });
  const { user, signOut } = useAuth();
  const [state, setState] = useState<OrdersState>({ kind: 'loading' });
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(ORDERS_QUERY)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error || !isOrderRowArray(data)) {
        setState({ kind: 'error' });
        return;
      }
      setState({ kind: 'ready', orders: data });
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
    } catch (caught) {
      setSignOutError(caught instanceof Error ? caught.message : 'Could not sign out. Please try again.');
      setSigningOut(false);
    }
  };

  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'there';

  return (
    <div className="bg-gradient-to-b from-gold-50/70 via-white to-white">
      <section className="mx-auto max-w-5xl px-5 pb-24 pt-32 sm:px-8 lg:pt-36">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">Hello, {displayName}</h1>
            <p className="mt-3 text-ink-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="inline-flex items-center gap-2 self-start rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-gold-400 hover:text-ink-900 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </Reveal>

        {signOutError && <p role="alert" className="mt-4 text-sm text-crimson-700">{signOutError}</p>}

        <div className="mt-12 space-y-6">
          {state.kind === 'loading' && (
            <div className="space-y-4">
              {[0, 1].map((key) => (
                <div key={key} className="skeleton h-40 rounded-3xl" />
              ))}
            </div>
          )}

          {state.kind === 'error' && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-crimson-50 bg-crimson-50 p-8 text-center">
              <AlertTriangle className="h-7 w-7 text-crimson-600" />
              <p className="text-crimson-700">We could not load your orders. Please refresh the page to try again.</p>
            </div>
          )}

          {state.kind === 'ready' && state.orders.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-gold-100 bg-white p-12 text-center shadow-sm">
              <PackageOpen className="h-10 w-10 text-gold-600" />
              <p className="font-display text-3xl font-semibold text-ink-900">No orders yet</p>
              <p className="max-w-md text-ink-500">Your orders will appear here once you check out from the shop.</p>
              <Link
                to="/shop"
                className="mt-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-500 hover:text-ink-900"
              >
                Browse the shop
              </Link>
            </div>
          )}

          {state.kind === 'ready' &&
            state.orders.map((order) => {
              const stepIndex = getStatusIndex(order.status);
              const progress = ((stepIndex + 1) / ORDER_STATUS_STEPS.length) * 100;
              return (
                <Reveal key={order.id}>
                  <article className="rounded-[2rem] border border-gold-100 bg-white p-7 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">Tracking code</p>
                        <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{order.tracking_code}</p>
                        <p className="mt-1 text-sm text-ink-500">Placed {formatDateTime(order.created_at)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-ink-900">{formatPrice(order.total_cents, order.currency)}</p>
                        <p className="mt-1 text-sm text-ink-500">
                          {getPaymentLabel(order.payment_method)}, {order.payment_status.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-ink-900">{ORDER_STATUS_STEPS[stepIndex]?.label ?? order.status}</span>
                        <Link to={`/track/${order.tracking_code}`} className="font-semibold text-gold-700 hover:text-gold-600">
                          Track order
                        </Link>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gold-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-[width] duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <ul className="mt-6 divide-y divide-ink-100 border-t border-ink-100">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                          <span className="text-ink-700">{item.product_name}</span>
                          <span className="text-ink-500">
                            {item.quantity} x {formatPrice(item.unit_price_cents, order.currency)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
        </div>
      </section>
    </div>
  );
}
