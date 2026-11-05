import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { PageLoader } from '@/components/ui/PageLoader';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { deleteProduct, updateProduct } from '@/lib/admin-products';
import { fetchProducts } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { PRODUCT_CATEGORIES, type Product } from '@/lib/types';
import { usePageMeta } from '@/hooks/usePageMeta';

const LOW_STOCK = 5;

function StockInput({ product, onSaved, onError }: { product: Product; onSaved: (p: Product) => void; onError: (m: string) => void }) {
  const [value, setValue] = useState(String(product.stock));

  useEffect(() => setValue(String(product.stock)), [product.stock]);

  const commit = async () => {
    const next = Number.parseInt(value, 10);
    if (!Number.isInteger(next) || next < 0) {
      setValue(String(product.stock));
      return;
    }
    if (next === product.stock) return;
    try {
      onSaved(await updateProduct(product.id, { stock: next }));
    } catch (caught) {
      setValue(String(product.stock));
      onError(caught instanceof Error ? caught.message : 'Could not update stock.');
    }
  };

  return (
    <input
      type="number"
      min={0}
      value={value}
      aria-label={`Stock for ${product.name}`}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className="field !w-24 !py-2 text-center"
    />
  );
}

export function AdminPage() {
  usePageMeta({ title: 'Admin', description: 'Shop administration.', noindex: true });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [editing, setEditing] = useState<Product | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setProducts(await fetchProducts());
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (notice?.kind !== 'ok') return;
    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const replaceProduct = (next: Product) => setProducts((current) => current.map((item) => (item.id === next.id ? next : item)));

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(
      (item) =>
        (category === 'All' || item.category === category) &&
        (term === '' || item.name.toLowerCase().includes(term) || item.slug.includes(term)),
    );
  }, [products, search, category]);

  const outOfStock = products.filter((item) => item.stock === 0).length;
  const lowStock = products.filter((item) => item.stock > 0 && item.stock <= LOW_STOCK).length;

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteProduct(deleting.id);
      setProducts((current) => current.filter((item) => item.id !== deleting.id));
      setNotice({ kind: 'ok', text: `Deleted "${deleting.name}".` });
      setDeleting(null);
    } catch (caught) {
      setNotice({ kind: 'error', text: caught instanceof Error ? caught.message : 'Could not delete the product.' });
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gold-50 via-white to-white px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">Manage products</h1>
            <p className="mt-3 text-ink-500">Changes go live in the shop immediately.</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Products', value: products.length },
            { label: `Low stock (${LOW_STOCK} or fewer)`, value: lowStock },
            { label: 'Out of stock', value: outOfStock },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-gold-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-ink-500">{stat.label}</p>
              <p className="mt-2 font-display text-4xl font-semibold text-ink-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {notice && (
          <p
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              notice.kind === 'error'
                ? 'border-crimson-50 bg-crimson-50 text-crimson-700'
                : 'border-gold-200 bg-gold-50 text-ink-800'
            }`}
          >
            {notice.text}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="field !pl-11"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="field sm:!w-64"
          >
            <option value="All">All categories</option>
            {PRODUCT_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
          {loading ? (
            <PageLoader />
          ) : loadError ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <AlertTriangle className="h-8 w-8 text-crimson-700" />
              <p className="text-ink-700">{loadError}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
              >
                Try again
              </button>
            </div>
          ) : visible.length === 0 ? (
            <p className="px-6 py-16 text-center text-ink-500">
              {products.length === 0 ? 'No products yet. Click "Add product" to create your first one.' : 'No products match your search.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead className="border-b border-ink-100 bg-gold-50/60 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {visible.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gold-50/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} alt="" className="h-14 w-14 shrink-0 rounded-xl border border-ink-100 object-cover" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink-900">{item.name}</p>
                            <p className="truncate text-xs text-ink-400">
                              /{item.slug}
                              {item.badge && (
                                <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 font-semibold text-gold-800">{item.badge}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-ink-600">{item.category}</td>
                      <td className="px-5 py-4 font-semibold text-ink-900">{formatPrice(item.price_cents)}</td>
                      <td className="px-5 py-4">
                        <StockInput
                          product={item}
                          onSaved={(next) => {
                            replaceProduct(next);
                            setNotice({ kind: 'ok', text: `Stock updated for "${next.name}".` });
                          }}
                          onError={(text) => setNotice({ kind: 'error', text })}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(item)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 px-4 py-2 text-xs font-semibold text-ink-900 transition hover:bg-gold-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(item)}
                            aria-label={`Delete ${item.name}`}
                            className="rounded-full border border-ink-200 p-2 text-ink-500 transition hover:border-crimson-700 hover:text-crimson-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <ProductFormDialog
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setProducts((current) =>
              isNew ? [...current, saved].sort((a, b) => a.name.localeCompare(b.name)) : current.map((item) => (item.id === saved.id ? saved : item)),
            );
            setNotice({ kind: 'ok', text: isNew ? `Added "${saved.name}".` : `Saved "${saved.name}".` });
            setEditing(null);
          }}
        />
      )}

      <Dialog open={deleting !== null} onClose={() => (deleteBusy ? undefined : setDeleting(null))} title="Delete product?">
        <div className="space-y-6 px-6 py-6">
          <p className="text-ink-600">
            "{deleting?.name}" will be removed from the shop. Past orders keep their record of it. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              disabled={deleteBusy}
              className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={deleteBusy}
              className="rounded-full bg-crimson-700 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {deleteBusy ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
