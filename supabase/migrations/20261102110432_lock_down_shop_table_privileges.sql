/*
# Remove write permissions from shop tables

1. Problem
- New tables inherited full read, insert, update and delete permissions for the anonymous and signed-in roles by default.
- Row security currently blocks those writes, but the permissions themselves are broader than the app needs.

2. Change
- Revokes insert, update and delete on products, orders and order_items from the anonymous and signed-in roles.
- Keeps read access only: products for everyone, orders and order_items for signed-in owners (row rules still apply).

3. Notes
- Orders are written only by the place_order function, so clients never need write access to these tables.
*/

REVOKE INSERT, UPDATE, DELETE ON products FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON order_items FROM anon, authenticated;

REVOKE SELECT ON orders FROM anon;
REVOKE SELECT ON order_items FROM anon;
REVOKE SELECT ON products FROM authenticated;
GRANT SELECT ON products TO authenticated;
