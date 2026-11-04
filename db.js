const path = require('path');
const Database = require('better-sqlite3');

const databasePath = process.env.DATABASE_PATH || path.join(__dirname, 'nexora.sqlite');
const demoSeedSetting = process.env.SEED_DEMO_DATA;
if (demoSeedSetting !== undefined && !['true', 'false'].includes(demoSeedSetting)) {
  throw new Error('SEED_DEMO_DATA must be true or false');
}
const seedDemoData = demoSeedSetting === undefined
  ? false
  : demoSeedSetting === 'true';
const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
db.pragma('cache_size = -32768');
db.pragma('temp_store = MEMORY');
db.pragma('journal_size_limit = 67108864');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    mobile TEXT,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS supplier_integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    last_sync_at TEXT,
    last_sync_status TEXT NOT NULL DEFAULT 'never',
    last_sync_error TEXT,
    last_sync_count INTEGER NOT NULL DEFAULT 0,
    last_sync_created INTEGER NOT NULL DEFAULT 0,
    last_sync_updated INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT,
    sku TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    original_price INTEGER,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL DEFAULT '',
    specifications_json TEXT NOT NULL DEFAULT '{}',
    image_url TEXT,
    image_class TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS catalog_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL CHECK (kind IN ('category', 'subcategory', 'brand', 'product_type', 'model')),
    parent_id INTEGER REFERENCES catalog_nodes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS catalog_nodes_sibling_name
    ON catalog_nodes(kind, COALESCE(parent_id, 0), name COLLATE NOCASE);
  CREATE TABLE IF NOT EXISTS cart_items (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 99),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id)
  );
  CREATE TABLE IF NOT EXISTS wishlist_items (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id)
  );
  CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    offers INTEGER NOT NULL DEFAULT 1 CHECK (offers IN (0, 1)),
    orders INTEGER NOT NULL DEFAULT 1 CHECK (orders IN (0, 1)),
    messages INTEGER NOT NULL DEFAULT 1 CHECK (messages IN (0, 1)),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order', 'offer', 'message')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS notifications_user_created ON notifications (user_id, created_at DESC, id DESC);
  CREATE TABLE IF NOT EXISTS seller_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    gst_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS advertising_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    campaign_details TEXT NOT NULL,
    monthly_budget INTEGER NOT NULL CHECK (monthly_budget >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS rewards_accounts (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS reward_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    coins INTEGER NOT NULL CHECK (coins > 0),
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS gift_card_wallets (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS gift_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchaser_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redeemer_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    code_hash TEXT NOT NULL UNIQUE,
    code_last_four TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'redeemed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    redeemed_at TEXT
  );
  CREATE TABLE IF NOT EXISTS gift_card_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gift_card_id INTEGER REFERENCES gift_cards(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('redeem', 'purchase', 'order')),
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home',
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    line TEXT NOT NULL,
    pincode TEXT NOT NULL,
    city TEXT,
    state TEXT,
    country TEXT NOT NULL DEFAULT 'India',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    subtotal INTEGER NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    delivery_fee INTEGER NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
    gift_card_discount INTEGER NOT NULL DEFAULT 0 CHECK (gift_card_discount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'demo',
    payment_status TEXT NOT NULL DEFAULT 'not_collected',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    address_name TEXT,
    address_mobile TEXT,
    address_line TEXT,
    address_pincode TEXT,
    total INTEGER NOT NULL CHECK (total >= 0),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    image_url TEXT,
    image_class TEXT,
    category TEXT,
    seller_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    fulfillment_status TEXT NOT NULL DEFAULT 'pending',
    shipped_at TEXT,
    delivered_at TEXT,
    tracking_provider TEXT,
    tracking_number TEXT,
    tracking_url TEXT,
    tracking_updated_at TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id INTEGER NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    refund_status TEXT NOT NULL DEFAULT 'not_applicable' CHECK (refund_status = 'not_applicable'),
    refund_review_required INTEGER NOT NULL DEFAULT 0 CHECK (refund_review_required IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS product_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_item_id INTEGER NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS product_reviews_public
    ON product_reviews (product_id, created_at DESC, id DESC);
`);
const supplierColumns = db.prepare('PRAGMA table_info(supplier_integrations)').all().map((column) => column.name);
[
  ['last_sync_status', "TEXT NOT NULL DEFAULT 'never'"],
  ['last_sync_error', 'TEXT'],
  ['last_sync_count', 'INTEGER NOT NULL DEFAULT 0'],
  ['last_sync_created', 'INTEGER NOT NULL DEFAULT 0'],
  ['last_sync_updated', 'INTEGER NOT NULL DEFAULT 0']
].forEach(([name, definition]) => {
  if (!supplierColumns.includes(name)) db.exec(`ALTER TABLE supplier_integrations ADD COLUMN ${name} ${definition}`);
});

// Add columns without rebuilding tables or deleting existing data.
const orderColumns = db.prepare('PRAGMA table_info(orders)').all().map((column) => column.name);
const addOrderColumn = (name, definition) => {
  if (!orderColumns.includes(name)) db.exec(`ALTER TABLE orders ADD COLUMN ${name} ${definition}`);
};
const userColumns = db.prepare('PRAGMA table_info(users)').all().map((column) => column.name);
if (!userColumns.includes('mobile')) db.exec('ALTER TABLE users ADD COLUMN mobile TEXT');
addOrderColumn('subtotal', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('delivery_fee', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('discount', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('gift_card_discount', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('payment_method', "TEXT NOT NULL DEFAULT 'demo'");
addOrderColumn('payment_status', "TEXT NOT NULL DEFAULT 'not_collected'");
addOrderColumn('razorpay_order_id', 'TEXT');
addOrderColumn('razorpay_payment_id', 'TEXT');
db.prepare("UPDATE orders SET payment_method = 'demo' WHERE payment_status = 'not_collected' AND payment_method != 'demo'").run();
addOrderColumn('address_name', 'TEXT');
addOrderColumn('address_mobile', 'TEXT');
addOrderColumn('address_line', 'TEXT');
addOrderColumn('address_pincode', 'TEXT');
const productColumns = db.prepare('PRAGMA table_info(products)').all().map((column) => column.name);
const addProductColumn = (name, definition) => {
  if (!productColumns.includes(name)) db.exec(`ALTER TABLE products ADD COLUMN ${name} ${definition}`);
};
addProductColumn('slug', 'TEXT');
addProductColumn('sku', 'TEXT');
addProductColumn('stock', 'INTEGER NOT NULL DEFAULT 0');
addProductColumn('popularity', 'INTEGER NOT NULL DEFAULT 0');
addProductColumn('description', "TEXT NOT NULL DEFAULT ''");
addProductColumn('specifications_json', "TEXT NOT NULL DEFAULT '{}'");
addProductColumn('image_url', 'TEXT');
addProductColumn('images_json', "TEXT NOT NULL DEFAULT '[]'");
addProductColumn('subcategory', "TEXT NOT NULL DEFAULT ''");
addProductColumn('product_type', "TEXT NOT NULL DEFAULT ''");
addProductColumn('model', "TEXT NOT NULL DEFAULT ''");
addProductColumn('variants_json', "TEXT NOT NULL DEFAULT '{}'");
addProductColumn('seller', "TEXT NOT NULL DEFAULT ''");
addProductColumn('delivery_information', "TEXT NOT NULL DEFAULT ''");
addProductColumn('seller_user_id', 'INTEGER REFERENCES users(id) ON DELETE SET NULL');
addProductColumn('source_feed_id', 'INTEGER REFERENCES supplier_integrations(id) ON DELETE SET NULL');
addProductColumn('external_product_id', 'TEXT');
addProductColumn('active', 'INTEGER NOT NULL DEFAULT 1');
addProductColumn('updated_at', 'TEXT');
db.prepare("UPDATE products SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)").run();
db.exec(`
  CREATE INDEX IF NOT EXISTS products_active_category ON products (active, category);
  CREATE INDEX IF NOT EXISTS products_active_brand ON products (active, brand);
  CREATE INDEX IF NOT EXISTS products_active_price ON products (active, price);
  CREATE INDEX IF NOT EXISTS products_active_rating ON products (active, rating);
  CREATE INDEX IF NOT EXISTS products_active_category_newest ON products (active, category, created_at DESC, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_newest ON products (active, created_at DESC, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_price_page ON products (active, price, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_rating_page ON products (active, rating DESC, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_name_page ON products (active, name COLLATE NOCASE, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_popularity_page ON products (active, popularity DESC, id DESC);
  CREATE INDEX IF NOT EXISTS products_active_category_lookup ON products (active, LOWER(TRIM(category)));
  CREATE INDEX IF NOT EXISTS products_active_brand_lookup ON products (active, LOWER(brand));
  CREATE INDEX IF NOT EXISTS products_active_seller_updated ON products (seller_user_id, updated_at DESC, id DESC);
  CREATE INDEX IF NOT EXISTS products_sku_nocase ON products (sku COLLATE NOCASE) WHERE sku IS NOT NULL;
  CREATE INDEX IF NOT EXISTS products_sku_normalized ON products (
    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', ''))
  ) WHERE sku IS NOT NULL AND TRIM(sku) != '';
  CREATE INDEX IF NOT EXISTS products_catalog_identity ON products (
    LOWER(TRIM(category)), LOWER(TRIM(brand)),
    LOWER(TRIM(CASE WHEN model IS NULL OR TRIM(model) = '' THEN name ELSE model END))
  ) WHERE sku IS NULL OR TRIM(sku) = '';
  CREATE INDEX IF NOT EXISTS products_source_feed ON products (source_feed_id, external_product_id);
  CREATE UNIQUE INDEX IF NOT EXISTS products_external_source
    ON products (source_feed_id, external_product_id)
    WHERE source_feed_id IS NOT NULL AND external_product_id IS NOT NULL;
  CREATE INDEX IF NOT EXISTS order_items_product ON order_items (product_id);
  CREATE INDEX IF NOT EXISTS order_items_order_id ON order_items (order_id, id);
  CREATE INDEX IF NOT EXISTS orders_user_id ON orders (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS addresses_user_id ON addresses (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS support_tickets_user_id ON support_tickets (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS advertising_requests_user_id ON advertising_requests (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS reward_transactions_user_id ON reward_transactions (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS gift_card_transactions_user_id ON gift_card_transactions (user_id, id DESC);
  CREATE INDEX IF NOT EXISTS notifications_user_id ON notifications (user_id, id DESC);
`);
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
    name, slug, sku, category, subcategory, brand, product_type, model, description,
    content='products', content_rowid='id', tokenize='unicode61 remove_diacritics 2'
  );
  CREATE TRIGGER IF NOT EXISTS products_fts_insert AFTER INSERT ON products BEGIN
    INSERT INTO products_fts(rowid, name, slug, sku, category, subcategory, brand, product_type, model, description)
    VALUES (new.id, new.name, new.slug, new.sku, new.category, new.subcategory, new.brand, new.product_type, new.model, new.description);
  END;
  CREATE TRIGGER IF NOT EXISTS products_fts_delete AFTER DELETE ON products BEGIN
    INSERT INTO products_fts(products_fts, rowid, name, slug, sku, category, subcategory, brand, product_type, model, description)
    VALUES ('delete', old.id, old.name, old.slug, old.sku, old.category, old.subcategory, old.brand, old.product_type, old.model, old.description);
  END;
  CREATE TRIGGER IF NOT EXISTS products_fts_update AFTER UPDATE ON products BEGIN
    INSERT INTO products_fts(products_fts, rowid, name, slug, sku, category, subcategory, brand, product_type, model, description)
    VALUES ('delete', old.id, old.name, old.slug, old.sku, old.category, old.subcategory, old.brand, old.product_type, old.model, old.description);
    INSERT INTO products_fts(rowid, name, slug, sku, category, subcategory, brand, product_type, model, description)
    VALUES (new.id, new.name, new.slug, new.sku, new.category, new.subcategory, new.brand, new.product_type, new.model, new.description);
  END;
  CREATE TABLE IF NOT EXISTS catalog_search_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);
if (!db.prepare("SELECT 1 FROM catalog_search_metadata WHERE key = 'products_fts_v1'").get()) {
  db.transaction(() => {
    db.prepare("INSERT INTO products_fts(products_fts) VALUES ('rebuild')").run();
    db.prepare("INSERT INTO catalog_search_metadata (key, value) VALUES ('products_fts_v1', 'ready')").run();
  })();
}
if (!db.prepare("SELECT 1 FROM catalog_search_metadata WHERE key = 'product_popularity_v1'").get()) {
  db.transaction(() => {
    db.prepare(`
      UPDATE products SET popularity = COALESCE(
        (SELECT SUM(quantity) FROM order_items WHERE order_items.product_id = products.id), 0
      )
    `).run();
    db.prepare("INSERT INTO catalog_search_metadata (key, value) VALUES ('product_popularity_v1', 'ready')").run();
  })();
}
db.exec(`
  CREATE TRIGGER IF NOT EXISTS products_popularity_insert AFTER INSERT ON order_items
  WHEN new.product_id IS NOT NULL BEGIN
    UPDATE products SET popularity = popularity + new.quantity WHERE id = new.product_id;
  END;
  CREATE TRIGGER IF NOT EXISTS products_popularity_update AFTER UPDATE OF quantity, product_id ON order_items BEGIN
    UPDATE products SET popularity = MAX(0, popularity - old.quantity)
      WHERE id = old.product_id AND old.product_id IS NOT NULL;
    UPDATE products SET popularity = popularity + new.quantity
      WHERE id = new.product_id AND new.product_id IS NOT NULL;
  END;
  CREATE TRIGGER IF NOT EXISTS products_popularity_delete AFTER DELETE ON order_items
  WHEN old.product_id IS NOT NULL BEGIN
    UPDATE products SET popularity = MAX(0, popularity - old.quantity) WHERE id = old.product_id;
  END;
`);
const itemColumns = db.prepare('PRAGMA table_info(order_items)').all().map((column) => column.name);
const returnColumns = db.prepare('PRAGMA table_info(order_returns)').all().map((column) => column.name);
if (!returnColumns.includes('refund_review_required')) {
  db.exec('ALTER TABLE order_returns ADD COLUMN refund_review_required INTEGER NOT NULL DEFAULT 0');
}
if (!itemColumns.includes('image_url')) db.exec('ALTER TABLE order_items ADD COLUMN image_url TEXT');
if (!itemColumns.includes('image_class')) db.exec('ALTER TABLE order_items ADD COLUMN image_class TEXT');
if (!itemColumns.includes('category')) db.exec('ALTER TABLE order_items ADD COLUMN category TEXT');
if (!itemColumns.includes('seller_user_id')) db.exec('ALTER TABLE order_items ADD COLUMN seller_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL');
if (!itemColumns.includes('fulfillment_status')) db.exec("ALTER TABLE order_items ADD COLUMN fulfillment_status TEXT NOT NULL DEFAULT 'pending'");
if (!itemColumns.includes('shipped_at')) db.exec('ALTER TABLE order_items ADD COLUMN shipped_at TEXT');
if (!itemColumns.includes('delivered_at')) db.exec('ALTER TABLE order_items ADD COLUMN delivered_at TEXT');
if (!itemColumns.includes('tracking_provider')) db.exec('ALTER TABLE order_items ADD COLUMN tracking_provider TEXT');
if (!itemColumns.includes('tracking_number')) db.exec('ALTER TABLE order_items ADD COLUMN tracking_number TEXT');
if (!itemColumns.includes('tracking_url')) db.exec('ALTER TABLE order_items ADD COLUMN tracking_url TEXT');
if (!itemColumns.includes('tracking_updated_at')) db.exec('ALTER TABLE order_items ADD COLUMN tracking_updated_at TEXT');
if (!itemColumns.includes('updated_at')) db.exec('ALTER TABLE order_items ADD COLUMN updated_at TEXT');
db.prepare(`
  UPDATE order_items SET seller_user_id = (
    SELECT seller_user_id FROM products WHERE products.id = order_items.product_id
  )
  WHERE product_id IS NOT NULL AND seller_user_id IS NULL
`).run();
db.exec(`
  CREATE INDEX IF NOT EXISTS order_items_status ON order_items (order_id, fulfillment_status);
  CREATE INDEX IF NOT EXISTS order_items_seller ON order_items (seller_user_id, fulfillment_status);
  CREATE INDEX IF NOT EXISTS order_returns_user ON order_returns (user_id, order_id);
  CREATE UNIQUE INDEX IF NOT EXISTS orders_razorpay_order ON orders (razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS orders_razorpay_payment ON orders (razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
`);

const seedProducts = [
  ['iPhone Pro Case', 499, 649, 'Mobiles', 'Apple', 4.8, 128, 'product-one', 25, 'Protective iPhone case with a slim premium finish.'],
  ['Wireless Earbuds', 699, 799, 'Electronics', 'Soundcore', 4.7, 96, 'product-two', 30, 'Compact wireless earbuds with clear sound and a charging case.'],
  ['Smart Watch', 899, 1099, 'Electronics', 'Samsung', 4.9, 214, 'product-three', 18, 'Feature-rich smart watch for fitness, notifications and everyday use.'],
  ['Travel Backpack', 1199, 1399, 'Fashion', 'Nexora', 4.6, 74, 'product-four', 20, 'Durable, spacious backpack designed for commutes and travel.'],
  ['Linen Everyday Shirt', 799, null, 'Fashion', 'Nexora', 4.7, 88, 'product-four', 24, 'Breathable linen shirt for comfortable everyday wear.'],
  ['Urban Crossbody Bag', 1299, null, 'Fashion', 'Nexora', 4.8, 61, 'product-one', 15, 'A practical crossbody bag with an easy urban style.'],
  ['MagSafe Fast Charger', 899, null, 'Mobiles', 'Apple', 4.9, 142, 'product-two', 22, 'Fast magnetic charger for compatible devices.'],
  ['Slim Phone Stand', 399, null, 'Mobiles', 'Nexora', 4.5, 57, 'product-three', 35, 'Compact stand that keeps your phone at a comfortable viewing angle.'],
  ['Noise Cancelling Headphones', 1499, null, 'Electronics', 'Soundcore', 4.8, 203, 'product-two', 12, 'Immersive headphones with active noise cancellation.'],
  ['Smart Home Hub', 999, null, 'Electronics', 'Samsung', 4.6, 79, 'product-three', 16, 'Connect and control compatible smart home devices from one hub.'],
  ['Glow Face Serum', 649, null, 'Beauty', 'Nexora', 4.7, 119, 'product-one', 28, 'Lightweight face serum for a refreshed, radiant look.'],
  ['Hydrating Lip Care Kit', 299, null, 'Beauty', 'Nexora', 4.5, 46, 'product-four', 40, 'Nourishing lip care essentials for daily hydration.'],
  ['Aroma Desk Lamp', 749, null, 'Home', 'Nexora', 4.6, 72, 'product-three', 14, 'Warm ambient desk lamp for a calm workspace.'],
  ['Cloud Cushion Set', 1099, null, 'Home', 'Nexora', 4.8, 53, 'product-four', 19, 'Soft decorative cushion set that adds comfort to any room.'],
  ['Compact Air Fryer', 2499, 2999, 'Appliances', 'Nexora', 4.7, 52, 'product-three', 12, 'A compact air fryer for quick, convenient everyday cooking.'],
  ['Creative Building Blocks', 549, null, 'Toys', 'Nexora', 4.8, 39, 'product-four', 30, 'Colourful building blocks for imaginative play and creative projects.'],
  ['Everyday Snack Box', 349, null, 'Food', 'Nexora', 4.6, 68, 'product-one', 45, 'A shareable selection of everyday snacks for home or work.'],
  ['Active Yoga Mat', 799, null, 'Sports', 'Nexora', 4.7, 83, 'product-two', 21, 'A supportive non-slip mat for yoga, stretching and home workouts.'],
  ['Modern Accent Chair', 3499, null, 'Furniture', 'Nexora', 4.5, 27, 'product-three', 8, 'A contemporary accent chair for a comfortable reading corner.'],
  ['The Little Things Journal', 299, null, 'Books', 'Nexora', 4.8, 42, 'product-four', 50, 'A thoughtfully designed journal for notes, lists and daily reflections.'],
  ['City Ride Helmet', 1299, 1599, '2 Wheelers', 'Nexora', 4.7, 34, 'product-two', 16, 'A comfortable protective helmet for everyday two-wheeler commutes.'],
  ['Everyday Sweatshirt', 999, 1499, 'Fashion', 'Nexora', 4.6, 42, 'product-four', 22, 'A soft everyday sweatshirt for comfortable layering.'],
  ['Comfort Boxer Set', 499, 799, 'Fashion', 'Nexora', 4.5, 36, 'product-one', 30, 'A breathable multipack of comfortable everyday boxers.'],
  ['Classic Cotton Kurta', 899, 1299, 'Fashion', 'Nexora', 4.7, 31, 'product-four', 18, 'A classic cotton kurta for relaxed and festive occasions.'],
  ['Festive Woven Saree', 1799, 2499, 'Fashion', 'Nexora', 4.8, 28, 'product-one', 12, 'A lightweight woven saree with a versatile festive look.'],
  ['Boult Evo Wireless Neckband', 8999, null, 'Electronics', 'Boult', 4.6, 64, 'product-two', 15, 'Wireless neckband with a 6000 mAh battery for extended listening.'],
  ['RC Monster Truck', 1299, 1699, 'Toys', 'Nexora', 4.7, 48, 'product-three', 17, 'A remote-control monster truck for indoor and outdoor play.'],
  ['Everyday Comfort Lingerie', 699, 999, 'Fashion', 'Nexora', 4.5, 25, 'product-one', 20, 'Soft, comfortable everyday lingerie in a range of sizes.'],
  ["Men's Casual Shirt", 799, 1199, 'Fashion', 'Nexora', 4.6, 39, 'product-four', 24, 'A versatile casual shirt made for everyday wear.'],
  ['Gaming Laptop Stand', 1499, 1999, 'Electronics', 'Nexora', 4.7, 52, 'product-three', 14, 'A sturdy adjustable stand for a comfortable gaming setup.'],
  ['Fastrack Active Watch', 2499, 3499, 'Electronics', 'Fastrack', 4.5, 43, 'product-two', 11, 'An active everyday watch with a clean, sporty design.'],
  ['Louis Philippe Formal Shirt', 2199, 3299, 'Fashion', 'Louis Philippe', 4.6, 33, 'product-four', 9, 'A refined formal shirt for work and special occasions.'],
  ['Action Pace Running Shoes', 1199, 1999, 'Sports', 'Action', 4.4, 29, 'product-three', 16, 'Lightweight running shoes for everyday activity.'],
  ['Ray-Ban Meta Smart Glasses', 29999, null, 'Electronics', 'Ray-Ban Meta', 4.7, 18, 'product-two', 5, 'Smart glasses combining hands-free audio and connected features.'],
  ['Colgate Daily Care Pack', 249, 349, 'Beauty', 'Colgate', 4.6, 57, 'product-one', 36, 'A practical daily oral-care essentials pack.'],
  ['boAt Wireless Headphones', 1799, 2499, 'Electronics', 'boAt', 4.7, 81, 'product-two', 20, 'Wireless headphones designed for music, calls and daily use.'],
  ['Nexora Gaming Laptop', 54999, 69999, 'Electronics', 'Nexora', 4.6, 21, 'product-three', 6, 'A gaming laptop for immersive play and demanding everyday tasks.'],
  ['Nexora Precision Trimmer', 899, 1299, 'Appliances', 'Nexora', 4.5, 37, 'product-one', 25, 'A rechargeable precision trimmer for convenient grooming at home.'],
  ['Nexora Flex Shaver', 1199, 1699, 'Appliances', 'Nexora', 4.4, 24, 'product-two', 19, 'A compact electric shaver for a smooth everyday grooming routine.'],
  ['City Electric Scooter', 72999, null, '2 Wheelers', 'Nexora', 4.5, 12, 'product-three', 4, 'A demo electric scooter listing for exploring two-wheeler products.']
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const canonicalCategories = [
  'Fashion', 'Mobiles', 'Electronics', 'Home & Kitchen', 'Beauty & Personal Care',
  'Grocery', 'Furniture', 'Appliances', 'Footwear', 'Books', 'Toys & Games',
  'Sports & Fitness', 'Automotive', 'Jewellery & Watches', 'Health & Personal Care',
  'Baby & Kids', 'Pet Supplies', 'Office & Stationery', 'Musical Instruments',
  'Tools & Home Improvement', 'Luggage & Travel', 'Garden & Outdoors',
  'Arts, Crafts & Sewing', 'Digital Products', 'Industrial & Scientific',
  'Collectibles & Art'
];
const canonicalCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  const aliases = {
    home: 'Home & Kitchen',
    beauty: 'Beauty & Personal Care',
    food: 'Grocery',
    toys: 'Toys & Games',
    sports: 'Sports & Fitness',
    '2 wheelers': 'Automotive'
  };
  const match = canonicalCategories.find((category) => category.toLowerCase() === normalized);
  return match || aliases[normalized] || String(value || '').trim();
};
const seededSubcategory = (name, category) => {
  const normalizedName = name.toLowerCase();
  switch (canonicalCategory(category)) {
    case 'Fashion':
      if (/kids|child|toddler/.test(normalizedName)) return 'Kids';
      if (/women|lingerie|saree|dress|skirt/.test(normalizedName)) return 'Women';
      if (/backpack|crossbody|bag/.test(normalizedName)) return 'Bags & Accessories';
      if (/men['’]s/.test(normalizedName)) return 'Men';
      return 'Clothing';
    case 'Mobiles':
      return /case|charger|stand|cover|accessor/.test(normalizedName) ? 'Accessories' : 'Smartphones';
    case 'Electronics':
      if (/laptop|computer/.test(normalizedName)) return 'Laptops';
      if (/television|\btv\b/.test(normalizedName)) return 'TVs';
      if (/headphone|earbud|neckband|speaker/.test(normalizedName)) return 'Headphones';
      if (/watch|wearable|glasses/.test(normalizedName)) return 'Wearables';
      if (/camera/.test(normalizedName)) return 'Cameras';
      return 'Smart Home';
    case 'Home & Kitchen':
      if (/cushion|bedding|bedsheet|pillow/.test(normalizedName)) return 'Bedding';
      if (/lamp|decor|wall art/.test(normalizedName)) return 'Decor';
      return 'Kitchenware';
    case 'Beauty & Personal Care':
      if (/serum|skin|face|lip|makeup/.test(normalizedName)) return 'Skincare';
      return 'Personal Care';
    case 'Appliances':
      if (/trimmer|shaver|groom/.test(normalizedName)) return 'Grooming Appliances';
      return 'Kitchen Appliances';
    case 'Grocery': return 'Food & Snacks';
    case 'Furniture': return 'Living Room';
    case 'Toys & Games':
      return /remote|truck|rc /.test(normalizedName) ? 'Remote Control Toys' : 'Building Toys';
    case 'Sports & Fitness':
      return /shoe|running/.test(normalizedName) ? 'Outdoor Sports' : 'Fitness Equipment';
    case 'Automotive': return 'Two Wheelers';
    case 'Books': return 'Non-fiction';
    default: return 'General';
  }
};
const upsertSeed = db.transaction(() => seedProducts.forEach((product) => {
  const [name, price, originalPrice, category, brand, rating, reviews, imageClass, stock, description] = product;
  const subcategory = seededSubcategory(name, category);
  const existing = db.prepare('SELECT id FROM products WHERE name = ?').get(name);
  if (existing) return;
  db.prepare(`INSERT INTO products
    (name, slug, price, original_price, stock, category, subcategory, product_type, model, brand, rating, reviews, description, image_class, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
    .run(name, slugify(name), price, originalPrice, stock, canonicalCategory(category), subcategory, subcategory, name, brand, rating, reviews, description, imageClass);
}));
if (seedDemoData && !db.prepare('SELECT 1 FROM products LIMIT 1').get()) upsertSeed();
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Beauty & Personal Care', 'beauty');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Home & Kitchen', 'home');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Grocery', 'food');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Toys & Games', 'toys');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Sports & Fitness', 'sports');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = ?').run('Automotive', '2 wheelers');

const catalogCategories = [...canonicalCategories];
const catalogSubcategories = {
  Fashion: ['Men', 'Women', 'Kids', 'Clothing', 'Ethnic Wear', 'Western Wear', 'Innerwear & Sleepwear', 'Bags & Accessories'],
  Mobiles: ['Smartphones', 'Feature Phones', 'Tablets', 'Mobile Accessories', 'Cases & Covers', 'Chargers & Cables', 'Smartwatches'],
  Electronics: ['Laptops', 'Desktops', 'TVs', 'Headphones', 'Speakers & Audio', 'Cameras', 'Wearables', 'Smart Home', 'Gaming'],
  'Home & Kitchen': ['Kitchenware', 'Kitchen Appliances', 'Cookware', 'Dining', 'Home Decor', 'Bedding', 'Bath', 'Cleaning'],
  'Beauty & Personal Care': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Bath & Body', 'Personal Care', 'Men’s Grooming'],
  Grocery: ['Food & Snacks', 'Beverages', 'Staples', 'Fresh Produce', 'Dairy & Bakery', 'Household Supplies', 'Pet Food'],
  Furniture: ['Living Room', 'Bedroom', 'Dining Room', 'Office Furniture', 'Kids’ Furniture', 'Mattresses', 'Storage'],
  Appliances: ['Kitchen Appliances', 'Home Appliances', 'Grooming Appliances', 'Air Conditioners', 'Refrigerators', 'Laundry'],
  Footwear: ['Men', 'Women', 'Kids', 'Sneakers', 'Sports Shoes', 'Formal Shoes', 'Sandals & Slippers'],
  Books: ['Fiction', 'Non-fiction', 'Education & Learning', 'Children’s Books', 'Comics & Graphic Novels', 'Professional'],
  'Toys & Games': ['Building Toys', 'Remote Control Toys', 'Board Games', 'Dolls & Plush', 'Learning Toys', 'Outdoor Play'],
  'Sports & Fitness': ['Fitness Equipment', 'Sports Wear', 'Outdoor Sports', 'Cycling', 'Team Sports', 'Yoga'],
  Automotive: ['Two Wheelers', 'Car Accessories', 'Helmets & Safety', 'Car Care', 'Tools & Spares', 'Vehicle Electronics'],
  'Jewellery & Watches': ['Watches', 'Fine Jewellery', 'Fashion Jewellery', 'Sunglasses', 'Wallets & Accessories'],
  'Health & Personal Care': ['Healthcare Devices', 'Nutrition', 'Wellness', 'First Aid', 'Mobility & Daily Living'],
  'Baby & Kids': ['Diapers & Wipes', 'Baby Clothing', 'Feeding & Nursing', 'Baby Care', 'Strollers & Car Seats', 'Maternity'],
  'Pet Supplies': ['Dog Supplies', 'Cat Supplies', 'Pet Food', 'Aquatics', 'Bird Supplies', 'Grooming & Health'],
  'Office & Stationery': ['Writing Supplies', 'Paper Products', 'School Supplies', 'Office Electronics', 'Art Supplies', 'Office Furniture'],
  'Musical Instruments': ['Guitars', 'Keyboards & Pianos', 'Drums & Percussion', 'Recording Equipment', 'Wind Instruments', 'Accessories'],
  'Tools & Home Improvement': ['Power Tools', 'Hand Tools', 'Electrical', 'Plumbing', 'Hardware', 'Paint & Supplies', 'Safety'],
  'Luggage & Travel': ['Suitcases', 'Backpacks', 'Travel Accessories', 'Duffel Bags', 'Laptop Bags', 'Travel Organizers'],
  'Garden & Outdoors': ['Garden Tools', 'Plants & Seeds', 'Outdoor Furniture', 'Grills & Outdoor Cooking', 'Camping & Hiking', 'Pest Control'],
  'Arts, Crafts & Sewing': ['Craft Supplies', 'Sewing Machines & Supplies', 'Painting & Drawing', 'Knitting & Crochet', 'Beading & Jewelry Making'],
  'Digital Products': ['Software', 'E-books', 'Digital Courses', 'Subscriptions', 'Downloadable Media'],
  'Industrial & Scientific': ['Lab Equipment', 'Safety Supplies', 'Test & Measurement', 'Industrial Tools', 'Material Handling'],
  'Collectibles & Art': ['Fine Art', 'Decorative Art', 'Coins & Currency', 'Trading Cards', 'Memorabilia', 'Handmade Collectibles']
};
const catalogBrandSeeds = {
  Fashion: {
    Men: ['Levi’s', 'Nike', 'Adidas', 'Puma', 'H&M', 'Roadster', 'Manyavar'],
    Women: ['Zara', 'H&M', 'Biba', 'Nike', 'Adidas', 'Fabindia', 'W'],
    Kids: ['Mothercare', 'H&M', 'Puma', 'Adidas', 'FirstCry'],
    'Bags & Accessories': ['Safari', 'Wildcraft', 'American Tourister']
  },
  Mobiles: {
    Smartphones: ['Samsung', 'Apple', 'OnePlus', 'Vivo', 'Oppo', 'Xiaomi', 'Realme', 'Motorola', 'Google'],
    'Feature Phones': ['Nokia', 'Samsung', 'Motorola', 'Lava', 'Jio'],
    Tablets: ['Apple', 'Samsung', 'Lenovo', 'Xiaomi'],
    Accessories: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Anker', 'Belkin']
  },
  Electronics: {
    Laptops: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI'],
    Desktops: ['Dell', 'HP', 'Lenovo', 'Apple'],
    TVs: ['Sony', 'Samsung', 'LG', 'TCL', 'Hisense'],
    Headphones: ['Sony', 'JBL', 'Soundcore', 'Bose', 'Sennheiser'],
    'Speakers & Audio': ['JBL', 'Sony', 'Bose', 'Marshall'],
    Cameras: ['Canon', 'Nikon', 'Sony', 'Fujifilm'],
    Wearables: ['Apple', 'Samsung', 'Garmin', 'Fitbit'],
    'Smart Home': ['Amazon', 'Google', 'Philips', 'TP-Link'],
    Gaming: ['Sony', 'Microsoft', 'Nintendo', 'Logitech']
  },
  'Home & Kitchen': {
    Kitchenware: ['Prestige', 'Hawkins', 'Pigeon', 'Wonderchef', 'Borosil'],
    Cookware: ['Prestige', 'Hawkins', 'Vinod', 'Wonderchef'],
    Decor: ['IKEA', 'Home Centre', 'Fabindia', 'Chumbak'],
    Bedding: ['Wakefit', 'Sleepwell', 'Duroflex', 'Spaces'],
    Cleaning: ['Lizol', 'Scotch-Brite', 'Milton']
  },
  'Beauty & Personal Care': {
    Skincare: ['Cetaphil', 'Minimalist', 'Neutrogena', 'The Ordinary'],
    Makeup: ['Maybelline', 'Lakme', 'MAC', 'Nykaa'],
    'Hair Care': ['L’Oréal Paris', 'Dove', 'TRESemmé', 'Mamaearth'],
    Fragrances: ['Calvin Klein', 'Ajmal', 'Forest Essentials'],
    'Personal Care': ['Philips', 'Braun', 'Gillette']
  },
  Grocery: {
    'Food & Snacks': ['Haldiram’s', 'ITC', 'Britannia', 'Parle'],
    Beverages: ['Tata Tea', 'Nescafé', 'Coca-Cola', 'Paper Boat'],
    Staples: ['Aashirvaad', 'Fortune', 'Tata Sampann'],
    'Fresh Produce': ['Nexora Fresh'],
    'Dairy & Bakery': ['Amul', 'Mother Dairy', 'Britannia'],
    'Household Supplies': ['Surf Excel', 'Tide', 'Vim']
  },
  Furniture: {
    'Living Room': ['IKEA', 'Godrej Interio', 'Urban Ladder', 'Wakefit'],
    Bedroom: ['Wakefit', 'Godrej Interio', 'Nilkamal'],
    'Dining Room': ['IKEA', 'Home Centre', 'Nilkamal'],
    'Office Furniture': ['Godrej Interio', 'Featherlite', 'IKEA'],
    Mattresses: ['Wakefit', 'Sleepwell', 'Duroflex']
  },
  Appliances: {
    'Kitchen Appliances': ['Philips', 'Prestige', 'Havells', 'Bajaj'],
    'Home Appliances': ['LG', 'Samsung', 'Whirlpool', 'Godrej'],
    'Grooming Appliances': ['Philips', 'Braun', 'Havells', 'Vega'],
    'Air Conditioners': ['Daikin', 'LG', 'Voltas', 'Blue Star'],
    Refrigerators: ['LG', 'Samsung', 'Whirlpool', 'Haier'],
    Laundry: ['LG', 'Samsung', 'IFB', 'Bosch']
  },
  Footwear: {
    Men: ['Nike', 'Adidas', 'Puma', 'Skechers', 'Bata'],
    Women: ['Nike', 'Adidas', 'Puma', 'Skechers', 'Bata'],
    Kids: ['Nike', 'Adidas', 'Puma', 'Bata'],
    Sneakers: ['Nike', 'Adidas', 'Puma', 'Converse'],
    'Sports Shoes': ['Nike', 'Adidas', 'Asics', 'Skechers'],
    'Formal Shoes': ['Bata', 'Clarks', 'Hush Puppies']
  },
  Books: {
    Fiction: ['Penguin Random House', 'HarperCollins', 'Pan Macmillan'],
    'Education & Learning': ['Pearson', 'McGraw Hill', 'Oxford University Press'],
    'Children’s Books': ['Scholastic', 'Amar Chitra Katha', 'Penguin'],
    Professional: ['O’Reilly Media', 'Packt', 'Wiley']
  },
  'Toys & Games': {
    'Building Toys': ['LEGO', 'Mattel', 'Hasbro'],
    'Remote Control Toys': ['Mattel', 'Hot Wheels', 'Nikko'],
    'Board Games': ['Hasbro', 'Mattel', 'Funskool'],
    'Dolls & Plush': ['Mattel', 'Barbie', 'Hamleys'],
    'Learning Toys': ['Funskool', 'LeapFrog', 'Smartivity']
  },
  'Sports & Fitness': {
    'Fitness Equipment': ['Decathlon', 'Boldfit', 'Cultsport'],
    'Sports Wear': ['Nike', 'Adidas', 'Puma', 'Under Armour'],
    'Outdoor Sports': ['Decathlon', 'Yonex', 'Cosco'],
    Cycling: ['Hero Cycles', 'Firefox', 'Decathlon'],
    'Team Sports': ['Nivia', 'Cosco', 'SG'],
    Yoga: ['Boldfit', 'Decathlon', 'Strauss']
  },
  Automotive: {
    'Two Wheelers': ['Honda', 'TVS', 'Hero MotoCorp', 'Bajaj'],
    'Car Accessories': ['3M', 'Philips', 'Bosch'],
    'Helmets & Safety': ['Studds', 'Vega', 'Steelbird'],
    'Car Care': ['3M', 'Turtle Wax', 'Meguiar’s'],
    'Vehicle Electronics': ['Bosch', 'Garmin', 'Philips']
  },
  'Jewellery & Watches': {
    Watches: ['Casio', 'Titan', 'Fossil', 'Seiko'],
    'Fine Jewellery': ['Tanishq', 'Malabar Gold & Diamonds', 'Kalyan Jewellers'],
    'Fashion Jewellery': ['Swarovski', 'Sukkhi', 'Voylla'],
    Sunglasses: ['Ray-Ban', 'Oakley', 'Fastrack']
  },
  'Health & Personal Care': {
    'Healthcare Devices': ['Omron', 'Dr Trust', 'Accu-Chek'],
    Nutrition: ['Optimum Nutrition', 'MuscleBlaze', 'Ensure'],
    Wellness: ['Himalaya', 'Dabur', 'Patanjali'],
    'First Aid': ['3M', 'Hansaplast', 'Dettol']
  },
  'Baby & Kids': {
    'Diapers & Wipes': ['Huggies', 'Pampers', 'MamyPoko'],
    'Baby Clothing': ['Mothercare', 'FirstCry', 'Carter’s'],
    'Feeding & Nursing': ['Philips Avent', 'Mee Mee', 'Chicco'],
    'Baby Care': ['Johnson’s Baby', 'Himalaya Baby', 'Sebamed'],
    'Strollers & Car Seats': ['Chicco', 'Joie', 'Graco']
  },
  'Pet Supplies': {
    'Dog Supplies': ['Pedigree', 'Drools', 'Royal Canin'],
    'Cat Supplies': ['Whiskas', 'Sheba', 'Purina'],
    'Pet Food': ['Royal Canin', 'Farmina', 'Drools'],
    Aquatics: ['Sobo', 'Tetra', 'Fluval'],
    'Bird Supplies': ['Vitapol', 'Vitakraft', 'Trixie'],
    'Grooming & Health': ['Himalaya Pet Care', 'Wahl', 'Trixie']
  },
  'Office & Stationery': {
    'Writing Supplies': ['Parker', 'Classmate', 'Camlin', 'Pilot'],
    'Paper Products': ['JK Paper', 'Classmate', 'Paperkraft'],
    'School Supplies': ['Classmate', 'Navneet', 'Camlin'],
    'Office Electronics': ['HP', 'Canon', 'Epson', 'Brother'],
    'Art Supplies': ['Faber-Castell', 'Camlin', 'Staedtler'],
    'Office Furniture': ['Godrej Interio', 'Featherlite', 'Nilkamal']
  },
  'Musical Instruments': {
    Guitars: ['Fender', 'Yamaha', 'Ibanez', 'Cort'],
    'Keyboards & Pianos': ['Yamaha', 'Casio', 'Roland', 'Korg'],
    'Drums & Percussion': ['Pearl', 'Roland', 'Yamaha'],
    'Recording Equipment': ['Shure', 'Focusrite', 'Audio-Technica'],
    'Wind Instruments': ['Yamaha', 'Jupiter', 'Hohner']
  },
  'Tools & Home Improvement': {
    'Power Tools': ['Bosch', 'DeWalt', 'Makita', 'Stanley'],
    'Hand Tools': ['Stanley', 'Taparia', 'Ingco'],
    Electrical: ['Havells', 'Anchor', 'Polycab'],
    Plumbing: ['Jaquar', 'Hindware', 'Cera'],
    Hardware: ['Godrej Locks', 'Yale', 'Europa'],
    'Paint & Supplies': ['Asian Paints', 'Berger', 'Nerolac'],
    Safety: ['3M', 'Karam', 'Honeywell']
  },
  'Luggage & Travel': {
    Suitcases: ['American Tourister', 'Samsonite', 'Safari', 'VIP'],
    Backpacks: ['Wildcraft', 'Skybags', 'Puma', 'American Tourister'],
    'Travel Accessories': ['Decathlon', 'Safari', 'Swiss Military'],
    'Duffel Bags': ['Nike', 'Adidas', 'Puma'],
    'Laptop Bags': ['Targus', 'Samsonite', 'Lenovo']
  },
  'Garden & Outdoors': {
    'Garden Tools': ['Fiskars', 'Wolf-Garten', 'Kraft Seeds'],
    'Plants & Seeds': ['Ugaoo', 'TrustBasket', 'AllThatGrows'],
    'Outdoor Furniture': ['IKEA', 'Nilkamal', 'Home Centre'],
    'Grills & Outdoor Cooking': ['Weber', 'Char-Broil', 'Campingaz'],
    'Camping & Hiking': ['Decathlon', 'Wildcraft', 'Quechua'],
    'Pest Control': ['Goodknight', 'Bayer', 'Godrej']
  },
  'Arts, Crafts & Sewing': {
    'Craft Supplies': ['Pidilite', 'Fevicryl', 'Faber-Castell'],
    'Sewing Machines & Supplies': ['Singer', 'Usha', 'Brother'],
    'Painting & Drawing': ['Winsor & Newton', 'Camlin', 'Faber-Castell'],
    'Knitting & Crochet': ['Pony', 'Addi', 'Tulip'],
    'Beading & Jewelry Making': ['Beadalon', 'Sukkhi', 'CraftsVilla']
  },
  'Digital Products': {
    Software: ['Microsoft', 'Adobe', 'Autodesk'],
    'E-books': ['Penguin Random House', 'HarperCollins', 'Packt'],
    'Digital Courses': ['Coursera', 'Udemy', 'LinkedIn Learning'],
    Subscriptions: ['Microsoft', 'Adobe', 'Google'],
    'Downloadable Media': ['Adobe', 'Autodesk', 'Corel']
  },
  'Industrial & Scientific': {
    'Lab Equipment': ['Thermo Fisher Scientific', 'Hach', 'Mettler Toledo'],
    'Safety Supplies': ['3M', 'Honeywell', 'Karam'],
    'Test & Measurement': ['Fluke', 'Keysight', 'Tektronix'],
    'Industrial Tools': ['Bosch', 'DeWalt', 'Makita'],
    'Material Handling': ['Godrej', 'Nilkamal', 'Usha Martin']
  },
  'Collectibles & Art': {
    'Fine Art': ['Sotheby’s', 'Christie’s', 'Gallery Collection'],
    'Decorative Art': ['Chumbak', 'Fabindia', 'Jaipur Rugs'],
    'Coins & Currency': ['India Government Mint', 'NumisBids'],
    'Trading Cards': ['Pokémon', 'Topps', 'Panini'],
    Memorabilia: ['Funko', 'Lego', 'Hasbro'],
    'Handmade Collectibles': ['Fabindia', 'CraftsVilla', 'Jaypore']
  }
};
const catalogProductSeeds = [
  ['Mobiles', 'Smartphones', 'OnePlus', 'Smartphones', 'OnePlus Nord'],
  ['Mobiles', 'Smartphones', 'Samsung', 'Galaxy A Series', 'Samsung Galaxy A series'],
  ['Mobiles', 'Smartphones', 'Samsung', '5G Phones', 'Samsung Galaxy A55 5G'],
  ['Electronics', 'Laptops', 'HP', 'Gaming Laptops', 'HP OMEN'],
  ['Electronics', 'TVs', 'Sony', 'Smart TVs', 'Sony BRAVIA'],
  ['Electronics', 'Headphones', 'Sony', 'Wireless Earbuds', 'Sony WF Series'],
  ['Fashion', 'Men', 'Levi’s', 'Cotton T-shirts', 'Levi’s Cotton T-shirt'],
  ['Footwear', 'Men', 'Nike', 'Running Shoes', 'Nike Running Shoes'],
  ['Books', 'Fiction', 'Penguin Random House', 'Contemporary Fiction', 'Penguin Modern Classics'],
  ['Home & Kitchen', 'Cookware', 'Prestige', 'Pressure Cookers', 'Prestige Popular'],
  ['Beauty & Personal Care', 'Skincare', 'Minimalist', 'Serums', 'Minimalist 10% Niacinamide'],
  ['Grocery', 'Food & Snacks', 'Britannia', 'Biscuits', 'Britannia Good Day'],
  ['Furniture', 'Living Room', 'IKEA', 'Sofas', 'IKEA KIVIK'],
  ['Appliances', 'Air Conditioners', 'Daikin', 'Inverter ACs', 'Daikin FTKM Series'],
  ['Toys & Games', 'Building Toys', 'LEGO', 'Building Sets', 'LEGO City'],
  ['Sports & Fitness', 'Fitness Equipment', 'Decathlon', 'Dumbbells', 'Decathlon Hex Dumbbells'],
  ['Automotive', 'Helmets & Safety', 'Studds', 'Full-face Helmets', 'Studds Thunder'],
  ['Jewellery & Watches', 'Watches', 'Casio', 'Digital Watches', 'Casio G-Shock'],
  ['Health & Personal Care', 'Healthcare Devices', 'Omron', 'Blood Pressure Monitors', 'Omron HEM Series'],
  ['Baby & Kids', 'Strollers & Car Seats', 'Chicco', 'Baby Strollers', 'Chicco Bravo'],
  ['Pet Supplies', 'Dog Supplies', 'Pedigree', 'Adult Dog Food', 'Pedigree Adult'],
  ['Office & Stationery', 'Writing Supplies', 'Parker', 'Fountain Pens', 'Parker Jotter'],
  ['Musical Instruments', 'Guitars', 'Yamaha', 'Acoustic Guitars', 'Yamaha F Series'],
  ['Tools & Home Improvement', 'Power Tools', 'Bosch', 'Cordless Drills', 'Bosch GSR Series'],
  ['Luggage & Travel', 'Suitcases', 'American Tourister', 'Hard-sided Suitcases', 'American Tourister Curio'],
  ['Garden & Outdoors', 'Garden Tools', 'Fiskars', 'Pruning Tools', 'Fiskars PowerGear'],
  ['Arts, Crafts & Sewing', 'Sewing Machines & Supplies', 'Singer', 'Mechanical Sewing Machines', 'Singer Heavy Duty'],
  ['Digital Products', 'Software', 'Microsoft', 'Office Productivity', 'Microsoft 365'],
  ['Industrial & Scientific', 'Test & Measurement', 'Fluke', 'Digital Multimeters', 'Fluke 117'],
  ['Collectibles & Art', 'Trading Cards', 'Pokémon', 'Trading Card Sets', 'Pokémon TCG']
];
const insertCatalogNode = db.prepare(`
  INSERT OR IGNORE INTO catalog_nodes (kind, parent_id, name) VALUES (?, ?, ?)
`);
const findCatalogNode = db.prepare(`
  SELECT id FROM catalog_nodes
  WHERE kind = ? AND COALESCE(parent_id, 0) = COALESCE(?, 0) AND name = ? COLLATE NOCASE
`);
const ensureCatalogNode = (kind, parentId, name) => {
  insertCatalogNode.run(kind, parentId, name);
  return findCatalogNode.get(kind, parentId, name).id;
};
const seedCatalogHierarchy = db.transaction(() => {
  const categoryIds = new Map();
  catalogCategories.forEach((category) => {
    const categoryId = ensureCatalogNode('category', null, category);
    categoryIds.set(category, categoryId);
    (catalogSubcategories[category] || []).forEach((subcategory) => {
      ensureCatalogNode('subcategory', categoryId, subcategory);
    });
    Object.entries(catalogBrandSeeds[category] || {}).forEach(([subcategory, brands]) => {
      const subcategoryId = ensureCatalogNode('subcategory', categoryId, subcategory);
      brands.forEach((brand) => ensureCatalogNode('brand', subcategoryId, brand));
    });
  });

  catalogProductSeeds.forEach(([category, subcategory, brand, productType, model]) => {
    const categoryId = categoryIds.get(category);
    const subcategoryId = ensureCatalogNode('subcategory', categoryId, subcategory);
    const brandId = ensureCatalogNode('brand', subcategoryId, brand);
    const productTypeId = ensureCatalogNode('product_type', brandId, productType);
    ensureCatalogNode('model', productTypeId, model);
  });

  db.prepare('SELECT category, subcategory, brand, product_type, model, name FROM products').all().forEach((product) => {
    const category = canonicalCategory(product.category);
    const categoryId = categoryIds.get(category) || ensureCatalogNode('category', null, category);
    const subcategoryId = ensureCatalogNode('subcategory', categoryId, product.subcategory || 'General');
    const brandId = ensureCatalogNode('brand', subcategoryId, product.brand || 'Unbranded');
    const typeId = ensureCatalogNode('product_type', brandId, product.product_type || 'General');
    ensureCatalogNode('model', typeId, product.model || product.name);
  });
});
seedCatalogHierarchy();
db.pragma('optimize');

module.exports = db;
