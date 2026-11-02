/*
# Seed the shop catalog with 21 goods

1. New Rows
- 21 products across six categories: Electronics, Tea & Ceramics, Textiles & Fashion, Home & Kitchen, Tools & Industrial, and Beauty & Wellness.
- Each product has a price in US dollars (stored in cents), a stock count, a stock photo, and an optional badge such as Bestseller, New or Limited.

2. Safety
- Uses ON CONFLICT on the product slug, so re-running this migration never duplicates products or overwrites edited rows.

3. Notes
- Prices and stock are sample values and can be edited directly in the database later.
*/

INSERT INTO products (slug, name, category, description, price_cents, stock, image_url, badge) VALUES
  ('wireless-noise-cancelling-headphones', 'Wireless Noise-Cancelling Headphones', 'Electronics', 'Over-ear Bluetooth headphones with active noise cancelling and a 30-hour battery.', 12900, 40, 'https://images.pexels.com/photos/815494/pexels-photo-815494.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bestseller'),
  ('flagship-smartphone-bundle', 'Flagship Smartphone Bundle', 'Electronics', 'Unlocked smartphone with protective case, ready for international networks.', 39900, 15, 'https://images.pexels.com/photos/3999587/pexels-photo-3999587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'New'),
  ('smart-architect-led-lamp', 'Smart Architect LED Desk Lamp', 'Electronics', 'Dimmable LED desk lamp with warm-to-cool colour temperature control.', 4900, 60, 'https://images.pexels.com/photos/7439754/pexels-photo-7439754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('dual-monitor-workstation-kit', 'Dual-Monitor Workstation Kit', 'Electronics', 'Adjustable monitor arms and cable management for a clean, productive desk.', 21900, 12, 'https://images.pexels.com/photos/15919233/pexels-photo-15919233.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Limited'),
  ('imperial-porcelain-tea-set', 'Imperial Porcelain Tea Set', 'Tea & Ceramics', 'Hand-finished porcelain teapot with six cups, presented in a gift box.', 18900, 10, 'https://images.pexels.com/photos/5189621/pexels-photo-5189621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bestseller'),
  ('blue-floral-teapot-collection', 'Blue Floral Teapot Collection', 'Tea & Ceramics', 'Traditional blue-and-white teapot with a fine glaze and stainless infuser.', 7500, 25, 'https://images.pexels.com/photos/36253266/pexels-photo-36253266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('premium-oolong-gift-box', 'Premium Oolong Gift Box', 'Tea & Ceramics', 'Single-origin oolong tea leaves in a sealed tin, ideal for corporate gifting.', 3900, 80, 'https://images.pexels.com/photos/6691993/pexels-photo-6691993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'New'),
  ('hand-painted-tea-cup-set', 'Hand-Painted Tea Cup Set', 'Tea & Ceramics', 'Set of four hand-painted cups with matching saucers.', 4500, 35, 'https://images.pexels.com/photos/36253267/pexels-photo-36253267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('gold-satin-fabric-bolt', 'Gold Satin Fabric Bolt', 'Textiles & Fashion', 'Lustrous satin sold in three-metre bolts for fashion and decor.', 2400, 120, 'https://images.pexels.com/photos/7232404/pexels-photo-7232404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('black-silk-fabric-roll', 'Black Silk Fabric Roll', 'Textiles & Fashion', 'Heavy-weight silk with a fluid drape, sold by the roll.', 5800, 50, 'https://images.pexels.com/photos/21926656/pexels-photo-21926656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('luxury-leather-handbag', 'Luxury Leather Handbag', 'Textiles & Fashion', 'Full-grain leather tote with brushed hardware and a structured silhouette.', 14900, 18, 'https://images.pexels.com/photos/9267583/pexels-photo-9267583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bestseller'),
  ('pastel-leather-tote', 'Pastel Leather Tote', 'Textiles & Fashion', 'Soft pastel leather tote with a detachable strap and interior pocket.', 11900, 22, 'https://images.pexels.com/photos/8335273/pexels-photo-8335273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'New'),
  ('artisan-dinnerware-set', 'Artisan Dinnerware Set', 'Home & Kitchen', 'Twelve-piece white stoneware dinnerware set, dishwasher and microwave safe.', 12900, 20, 'https://images.pexels.com/photos/14341974/pexels-photo-14341974.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('colorful-ceramic-bowl-collection', 'Colorful Ceramic Bowl Collection', 'Home & Kitchen', 'Set of six glazed ceramic bowls in complementary colours.', 4900, 45, 'https://images.pexels.com/photos/3847438/pexels-photo-3847438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('glazed-stoneware-plate-set', 'Glazed Stoneware Plate Set', 'Home & Kitchen', 'Four dining plates with a hand-glazed finish and matte rim.', 8900, 30, 'https://images.pexels.com/photos/3847451/pexels-photo-3847451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('pro-angle-grinder-125mm', 'Pro Angle Grinder 125mm', 'Tools & Industrial', 'Variable-speed angle grinder with anti-vibration handle and safety guard.', 8400, 40, 'https://images.pexels.com/photos/162534/grinder-hitachi-power-tool-flexible-162534.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bestseller'),
  ('industrial-workshop-tool-kit', 'Industrial Workshop Tool Kit', 'Tools & Industrial', 'Complete hand and power tool kit housed in a lockable steel cabinet.', 21000, 14, 'https://images.pexels.com/photos/8986173/pexels-photo-8986173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('heavy-duty-welding-station', 'Heavy-Duty Welding Station', 'Tools & Industrial', 'Multi-process welding station built for professional workshops.', 34000, 6, 'https://images.pexels.com/photos/16243257/pexels-photo-16243257.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Limited'),
  ('botanical-skincare-collection', 'Botanical Skincare Collection', 'Beauty & Wellness', 'Five-piece botanical skincare range for daily hydration and renewal.', 9600, 40, 'https://images.pexels.com/photos/7670737/pexels-photo-7670737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Bestseller'),
  ('luxury-cosmetic-bottle-set', 'Luxury Cosmetic Bottle Set', 'Beauty & Wellness', 'Set of refillable glass bottles with ribbon detail, ideal for premium brands.', 6400, 30, 'https://images.pexels.com/photos/13186049/pexels-photo-13186049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL),
  ('minimalist-skincare-essentials', 'Minimalist Skincare Essentials', 'Beauty & Wellness', 'Gentle cleanser, serum and moisturiser in a three-step routine.', 5200, 55, 'https://images.pexels.com/photos/7670676/pexels-photo-7670676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', NULL)
ON CONFLICT (slug) DO NOTHING;
