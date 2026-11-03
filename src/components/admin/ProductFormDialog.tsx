import { useRef, useState, type FormEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { createProduct, slugify, updateProduct, uploadProductImage, type ProductInput } from '@/lib/admin-products';
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from '@/lib/types';

interface ProductFormDialogProps {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product, isNew: boolean) => void;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function ProductFormDialog({ product, onClose, onSaved }: ProductFormDialogProps) {
  const isNew = product === null;
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? (product.price_cents / 100).toFixed(2) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '0');
  const [badge, setBadge] = useState(product?.badge ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setImageUrl(await uploadProductImage(file));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceNumber = Number.parseFloat(price);
    const stockNumber = Number.parseInt(stock, 10);

    if (!name.trim()) return setError('Please enter a product name.');
    if (!SLUG_PATTERN.test(slug)) return setError('The URL name can only use lowercase letters, numbers and dashes.');
    if (!Number.isFinite(priceNumber) || priceNumber < 0) return setError('Please enter a valid price.');
    if (!Number.isInteger(stockNumber) || stockNumber < 0) return setError('Stock must be a whole number, 0 or more.');
    if (!imageUrl.trim()) return setError('Please upload an image or paste an image link.');

    const input: ProductInput = {
      name: name.trim(),
      slug,
      category,
      description: description.trim(),
      price_cents: Math.round(priceNumber * 100),
      stock: stockNumber,
      image_url: imageUrl.trim(),
      badge: badge.trim() || null,
    };

    setSaving(true);
    setError(null);
    try {
      const saved = isNew ? await createProduct(input) : await updateProduct(product.id, input);
      onSaved(saved, isNew);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the product.');
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} title={isNew ? 'Add product' : 'Edit product'}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="grid flex-1 gap-8 overflow-y-auto px-6 py-6 md:grid-cols-[18rem_1fr]">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border border-ink-100 bg-gold-50">
              {imageUrl ? (
                <img src={imageUrl} alt="Product preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-300">
                  <ImagePlus className="h-10 w-10" />
                </div>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-5 py-3 text-sm font-semibold text-ink-900 transition hover:border-gold-500 hover:bg-gold-100 disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload image'}
            </button>
            <TextField
              id="product-image-url"
              label="Or paste an image link"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://..."
              hint="JPG, PNG, WebP or GIF, up to 5 MB"
            />
          </div>

          <div className="space-y-5">
            <TextField id="product-name" label="Product name" value={name} onChange={handleNameChange} required maxLength={120} />
            <TextField
              id="product-slug"
              label="URL name"
              value={slug}
              onChange={(value) => {
                setSlugTouched(true);
                setSlug(value);
              }}
              required
              hint="Lowercase letters, numbers and dashes. Filled in automatically from the name."
            />
            <div className="space-y-2">
              <label htmlFor="product-category" className="block text-sm font-medium text-ink-700">
                Category<span className="text-gold-700"> *</span>
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as ProductCategory)}
                className="field"
              >
                {PRODUCT_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField id="product-price" label="Price (USD)" type="number" value={price} onChange={setPrice} required hint="e.g. 24.99" />
              <TextField id="product-stock" label="Stock" type="number" value={stock} onChange={setStock} required />
              <TextField id="product-badge" label="Badge" value={badge} onChange={setBadge} maxLength={24} hint="Optional, e.g. New" />
            </div>
            <TextField id="product-description" label="Description" value={description} onChange={setDescription} rows={5} />
          </div>
        </div>

        <footer className="border-t border-ink-100 px-6 py-4">
          {error && (
            <p role="alert" className="mb-4 rounded-2xl border border-crimson-50 bg-crimson-50 px-4 py-3 text-sm text-crimson-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isNew ? 'Add product' : 'Save changes'}
            </button>
          </div>
        </footer>
      </form>
    </Dialog>
  );
}
