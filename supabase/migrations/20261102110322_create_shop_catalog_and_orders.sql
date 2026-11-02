/*
# Create shop catalog and order tables

1. New Tables
- `products`: goods sold in the shop. Each row has a name, slug, category, description, price in cents, stock count, image, and optional badge.
- `orders`: one row per customer order. Stores the buyer, payment method, status, totals, shipping details and a public tracking code.
- `order_items`: the individual products inside an order, with the price and quantity at the time of purchase.

2. Security
- RLS is enabled on all three tables.
- `products` is a public catalog: anonymous and signed-in visitors can read it. Nobody can change it from the website.
- `orders` and `order_items` can only be read by the signed-in customer who owns them. Clients cannot insert, update or delete them directly; orders are created through a protected server function.

3. Notes
- Order tracking for guests is provided by a separate function that only returns non-sensitive status information.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'Electronics',
    'Tea & Ceramics',
    'Textiles & Fashion',
    'Home & Kitchen',
    'Tools & Industrial',
    'Beauty & Wellness'
  )),
  description text NOT NULL DEFAULT '',
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text NOT NULL,
  badge text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_products" ON products;
-- Intentionally public: the shop catalog is shown to every visitor.
CREATE POLICY "public_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code text UNIQUE NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'placed' CHECK (status IN (
    'placed', 'confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'
  )),
  payment_method text NOT NULL CHECK (payment_method IN (
    'wechat_pay', 'alipay', 'paypal', 'international_card'
  )),
  payment_status text NOT NULL DEFAULT 'awaiting_payment',
  total_cents integer NOT NULL CHECK (total_cents >= 0),
  currency text NOT NULL DEFAULT 'USD',
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  recipient_phone text NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL DEFAULT '',
  country text NOT NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders (user_id, created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON orders TO authenticated;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON order_items TO authenticated;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
