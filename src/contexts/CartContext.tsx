import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/types';

const STORAGE_KEY = 'godfather-cart-v1';
export const MAX_QUANTITY_PER_LINE = 99;

interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotalCents: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  catalogLoading: boolean;
  catalogError: string | null;
  reloadCatalog: () => Promise<void>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false;
  const line = value as CartLine;
  return (
    typeof line.productId === 'string' &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0 &&
    line.quantity <= MAX_QUANTITY_PER_LINE
  );
}

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines);
  const [isOpen, setIsOpen] = useState(false);
  const { products, loading, error, reload } = useProducts();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const productById = new Map(products.map((product) => [product.id, product]));

    const items: CartItem[] = lines.flatMap((line) => {
      const product = productById.get(line.productId);
      if (!product) return [];
      return [
        {
          product,
          quantity: line.quantity,
          lineTotalCents: product.price_cents * line.quantity,
        },
      ];
    });

    const clampToStock = (productId: string, quantity: number) => {
      const product = productById.get(productId);
      const stockCap = product ? Math.max(product.stock, 0) : MAX_QUANTITY_PER_LINE;
      return Math.min(quantity, MAX_QUANTITY_PER_LINE, stockCap);
    };

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotalCents: items.reduce((total, item) => total + item.lineTotalCents, 0),
      catalogLoading: loading,
      catalogError: error,
      reloadCatalog: async () => {
        await reload();
      },
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (productId, quantity = 1) => {
        setLines((prev) => {
          const existing = prev.find((line) => line.productId === productId);
          const nextQuantity = clampToStock(productId, (existing?.quantity ?? 0) + quantity);
          if (nextQuantity <= 0) return prev;
          if (!existing) return [...prev, { productId, quantity: nextQuantity }];
          return prev.map((line) =>
            line.productId === productId ? { ...line, quantity: nextQuantity } : line
          );
        });
      },
      setQuantity: (productId, quantity) => {
        setLines((prev) => {
          const nextQuantity = clampToStock(productId, quantity);
          if (nextQuantity <= 0) return prev.filter((line) => line.productId !== productId);
          return prev.map((line) =>
            line.productId === productId ? { ...line, quantity: nextQuantity } : line
          );
        });
      },
      removeItem: (productId) => {
        setLines((prev) => prev.filter((line) => line.productId !== productId));
      },
      clearCart: () => setLines([]),
    };
  }, [lines, products, loading, error, reload, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
