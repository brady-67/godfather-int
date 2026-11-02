/*
# Add secure order placement and order tracking functions

1. New Functions
- `place_order(p_items, p_shipping, p_payment_method)`: signed-in customers place an order. Prices are read from the product table on the server (never trusted from the browser), stock is checked and reduced, and a tracking code is generated.
- `track_order(p_code)`: anyone with a tracking code can see its status, timeline details and item names. Personal details such as address and email are never returned.

2. Security
- `place_order` is callable only by signed-in users. It runs with elevated rights but always stamps the order with the caller's own user id.
- `track_order` is callable by guests and signed-in users and only exposes non-sensitive fields.
- Both functions have their default public execute permission removed.

3. Notes
- Payment is not connected yet: new orders are saved with payment status "awaiting_payment".
*/

CREATE OR REPLACE FUNCTION place_order(
  p_items jsonb,
  p_shipping jsonb,
  p_payment_method text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_item jsonb;
  v_product products%ROWTYPE;
  v_qty integer;
  v_total integer := 0;
  v_order_id uuid;
  v_code text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Please sign in to place an order.';
  END IF;

  IF p_payment_method NOT IN ('wechat_pay', 'alipay', 'paypal', 'international_card') THEN
    RAISE EXCEPTION 'Unsupported payment method.';
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Your cart is empty.';
  END IF;

  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Too many different items in one order.';
  END IF;

  IF coalesce(trim(p_shipping->>'name'), '') = ''
    OR coalesce(trim(p_shipping->>'email'), '') = ''
    OR coalesce(trim(p_shipping->>'phone'), '') = ''
    OR coalesce(trim(p_shipping->>'address_line'), '') = ''
    OR coalesce(trim(p_shipping->>'city'), '') = ''
    OR coalesce(trim(p_shipping->>'country'), '') = '' THEN
    RAISE EXCEPTION 'Please complete all required shipping details.';
  END IF;

  IF length(p_shipping->>'name') > 120
    OR length(p_shipping->>'email') > 255
    OR length(p_shipping->>'phone') > 40
    OR length(p_shipping->>'address_line') > 240
    OR length(p_shipping->>'city') > 120
    OR length(p_shipping->>'country') > 120
    OR length(coalesce(p_shipping->>'postal_code', '')) > 20
    OR length(coalesce(p_shipping->>'notes', '')) > 1000 THEN
    RAISE EXCEPTION 'One of the shipping fields is too long.';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::integer;
    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 99 THEN
      RAISE EXCEPTION 'Quantities must be between 1 and 99.';
    END IF;

    SELECT * INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::uuid
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'One of the products is no longer available.';
    END IF;

    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Only % left in stock for %.', v_product.stock, v_product.name;
    END IF;

    v_total := v_total + v_product.price_cents * v_qty;
  END LOOP;

  v_code := 'GIT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  INSERT INTO orders (
    tracking_code, user_id, payment_method, total_cents,
    recipient_name, recipient_email, recipient_phone,
    address_line, city, postal_code, country, notes
  ) VALUES (
    v_code, v_user, p_payment_method, v_total,
    trim(p_shipping->>'name'), trim(p_shipping->>'email'), trim(p_shipping->>'phone'),
    trim(p_shipping->>'address_line'), trim(p_shipping->>'city'),
    coalesce(trim(p_shipping->>'postal_code'), ''), trim(p_shipping->>'country'),
    coalesce(trim(p_shipping->>'notes'), '')
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::integer;

    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
    VALUES (v_order_id, v_product.id, v_product.name, v_product.price_cents, v_qty);

    UPDATE products SET stock = stock - v_qty WHERE id = v_product.id;
  END LOOP;

  RETURN json_build_object(
    'id', v_order_id,
    'tracking_code', v_code,
    'total_cents', v_total
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION place_order(jsonb, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION place_order(jsonb, jsonb, text) TO authenticated;

CREATE OR REPLACE FUNCTION track_order(p_code text)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'tracking_code', o.tracking_code,
    'status', o.status,
    'payment_method', o.payment_method,
    'payment_status', o.payment_status,
    'total_cents', o.total_cents,
    'currency', o.currency,
    'city', o.city,
    'country', o.country,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'items', coalesce((
      SELECT json_agg(json_build_object('name', i.product_name, 'quantity', i.quantity) ORDER BY i.product_name)
      FROM order_items i
      WHERE i.order_id = o.id
    ), '[]'::json)
  )
  FROM orders o
  WHERE o.tracking_code = upper(trim(p_code))
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION track_order(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION track_order(text) TO anon, authenticated;
