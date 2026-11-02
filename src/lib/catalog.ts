import type { Product, ProductCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, category, description, price_cents, stock, image_url, badge')
    .order('name', { ascending: true });

  if (error) {
    throw new Error('We could not load the shop right now. Please try again.');
  }

  return (data ?? []) as Product[];
}

export function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});
}

export type CategoryFilter = ProductCategory | 'All';
