const path = require('path');
const Database = require('better-sqlite3');

const databasePath = process.env.DATABASE_PATH || path.join(__dirname, 'nexora.sqlite');
const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
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
    image_url TEXT,
    image_class TEXT,
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    category TEXT
  );
`);

// Add columns without rebuilding tables or deleting existing data.
const orderColumns = db.prepare('PRAGMA table_info(orders)').all().map((column) => column.name);
const addOrderColumn = (name, definition) => {
  if (!orderColumns.includes(name)) db.exec(`ALTER TABLE orders ADD COLUMN ${name} ${definition}`);
};
addOrderColumn('subtotal', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('delivery_fee', 'INTEGER NOT NULL DEFAULT 0');
addOrderColumn('discount', 'INTEGER NOT NULL DEFAULT 0');
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
addProductColumn('description', "TEXT NOT NULL DEFAULT ''");
addProductColumn('image_url', 'TEXT');
addProductColumn('active', 'INTEGER NOT NULL DEFAULT 1');
addProductColumn('updated_at', 'TEXT');
db.prepare("UPDATE products SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)").run();
const itemColumns = db.prepare('PRAGMA table_info(order_items)').all().map((column) => column.name);
if (!itemColumns.includes('image_url')) db.exec('ALTER TABLE order_items ADD COLUMN image_url TEXT');
if (!itemColumns.includes('image_class')) db.exec('ALTER TABLE order_items ADD COLUMN image_class TEXT');
if (!itemColumns.includes('category')) db.exec('ALTER TABLE order_items ADD COLUMN category TEXT');

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
  ['Cloud Cushion Set', 1099, null, 'Home', 'Nexora', 4.8, 53, 'product-four', 19, 'Soft decorative cushion set that adds comfort to any room.']
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const canonicalCategories = ['Fashion', 'Mobiles', 'Electronics', 'Beauty', 'Home'];
const canonicalCategory = (value) => {
  const match = canonicalCategories.find((category) => category.toLowerCase() === String(value || '').trim().toLowerCase());
  return match || String(value || '').trim();
};
const upsertSeed = db.transaction(() => seedProducts.forEach((product) => {
  const [name, price, originalPrice, category, brand, rating, reviews, imageClass, stock, description] = product;
  const existing = db.prepare('SELECT id FROM products WHERE name = ?').get(name);
  if (existing) {
    db.prepare(`UPDATE products SET price=?, original_price=?, category=?, brand=?, rating=?, reviews=?,
      image_class=COALESCE(image_class, ?), stock=CASE WHEN stock=0 THEN ? ELSE stock END,
      description=CASE WHEN description='' OR description IS NULL THEN ? ELSE description END,
      slug=COALESCE(NULLIF(slug, ''), ?), active=COALESCE(active, 1), updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(price, originalPrice, canonicalCategory(category), brand, rating, reviews, imageClass, stock, description, slugify(name), existing.id);
  } else {
    db.prepare(`INSERT INTO products
      (name, slug, price, original_price, stock, category, brand, rating, reviews, description, image_class, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
      .run(name, slugify(name), price, originalPrice, stock, canonicalCategory(category), brand, rating, reviews, description, imageClass);
  }
}));
upsertSeed();
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))').run('Fashion', 'fashion');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))').run('Mobiles', 'mobiles');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))').run('Electronics', 'electronics');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))').run('Beauty', 'beauty');
db.prepare('UPDATE products SET category = ? WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))').run('Home', 'home');

module.exports = db;
