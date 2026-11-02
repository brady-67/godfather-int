export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Tea & Ceramics',
  'Textiles & Fashion',
  'Home & Kitchen',
  'Tools & Industrial',
  'Beauty & Wellness',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  price_cents: number;
  stock: number;
  image_url: string;
  badge: string | null;
}

export const PAYMENT_METHODS = [
  { id: 'wechat_pay', label: 'WeChat Pay', hint: 'Scan and pay in WeChat' },
  { id: 'alipay', label: 'Alipay', hint: 'Pay with the Alipay app' },
  { id: 'paypal', label: 'PayPal', hint: 'Pay with your PayPal balance' },
  { id: 'international_card', label: 'International Card', hint: 'Visa, Mastercard, Amex' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];

export const ORDER_STATUS_STEPS = [
  { id: 'placed', label: 'Order placed', description: 'We have received your order.' },
  { id: 'confirmed', label: 'Order confirmed', description: 'Your order details are verified.' },
  { id: 'preparing', label: 'Preparing shipment', description: 'Goods are being packed and checked.' },
  { id: 'shipped', label: 'Shipped', description: 'Your parcel has left our warehouse.' },
  { id: 'in_transit', label: 'In transit', description: 'On its way to your destination.' },
  { id: 'delivered', label: 'Delivered', description: 'Your order has arrived.' },
] as const;

export type OrderStatus = (typeof ORDER_STATUS_STEPS)[number]['id'];

export function getPaymentLabel(method: string): string {
  return PAYMENT_METHODS.find((m) => m.id === method)?.label ?? 'Unknown method';
}

export function getStatusIndex(status: string): number {
  return ORDER_STATUS_STEPS.findIndex((s) => s.id === status);
}

export interface OrderItemRow {
  id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  tracking_code: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItemRow[];
}

export interface TrackedOrder {
  tracking_code: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: string;
  total_cents: number;
  currency: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
  items: { name: string; quantity: number }[];
}

export interface PlacedOrder {
  id: string;
  tracking_code: string;
  total_cents: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string;
}
