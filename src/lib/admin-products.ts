import { supabase } from '@/lib/supabase';
import type { Product, ProductCategory } from '@/lib/types';

const PRODUCT_COLUMNS = 'id, slug, name, category, description, price_cents, stock, image_url, badge';
const IMAGE_BUCKET = 'product-images';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export interface ProductInput {
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  price_cents: number;
  stock: number;
  image_url: string;
  badge: string | null;
}

interface DbError {
  code?: string;
  message: string;
}

function toFriendlyError(error: DbError, fallback: string): Error {
  if (error.code === '23505') return new Error('Another product already uses this URL name. Change the slug and try again.');
  if (error.code === '42501' || error.message.toLowerCase().includes('row-level security')) {
    return new Error('You do not have permission to do that. Make sure you are signed in as an admin.');
  }
  return new Error(fallback);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(input).select(PRODUCT_COLUMNS).single();
  if (error) throw toFriendlyError(error, 'Could not create the product. Please try again.');
  return data as Product;
}

export async function updateProduct(id: string, changes: Partial<ProductInput>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(changes)
    .eq('id', id)
    .select(PRODUCT_COLUMNS)
    .maybeSingle();
  if (error) throw toFriendlyError(error, 'Could not save your changes. Please try again.');
  if (!data) throw new Error('Nothing was saved. You may not have admin access, or the product no longer exists.');
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
  if (error) throw toFriendlyError(error, 'Could not delete the product. Please try again.');
  if (!data || data.length === 0) {
    throw new Error('Nothing was deleted. You may not have admin access, or the product no longer exists.');
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw new Error('Please choose a JPG, PNG, WebP or GIF image.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('That image is larger than 5 MB. Please choose a smaller one.');

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw new Error('Could not upload the image. Check that you are an admin and try again.');

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
