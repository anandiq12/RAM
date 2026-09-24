const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3000;
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const publicFile = path.join(__dirname, 'Index.html');
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const key = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${key}`;
};
const verifyPassword = (password, stored) => {
  const [salt, key] = String(stored).split(':');
  if (!salt || !key) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(key, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
};
const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  created_at: user.created_at
});
const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
const requireAuth = (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const session = token && db.prepare(`
    SELECT u.id, u.name, u.email, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
  `).get(tokenHash(token));
  if (!session) return res.status(401).json({ error: 'Authentication required' });
  req.user = session;
  next();
};
const issueToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash, user_id) VALUES (?, ?)').run(tokenHash(token), userId);
  return token;
};
const integer = (value, field) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw fail(`${field} must be a non-negative integer`);
  return number;
};
const validName = (value) => typeof value === 'string'
  && /^[\p{L}\p{N} .,'-]{2,80}$/u.test(value.trim());
const validEmail = (value) => typeof value === 'string'
  && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
const validAddress = (body) => validName(body.name)
  && /^\d{10}$/.test(String(body.mobile))
  && typeof body.line === 'string' && body.line.trim().length >= 8 && body.line.trim().length <= 240
  && /^\d{6}$/.test(String(body.pincode))
  && ['Home', 'Work', 'Other'].includes(body.label || 'Home');
const requireAdmin = (req, res, next) => {
  if (!process.env.ADMIN_KEY) return res.status(404).json({ error: 'Not found' });
  if (req.get('x-admin-key') !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });
  next();
};
const productFields = 'id, name, slug, sku, image_url, image_class, price, original_price, stock, category, brand, rating, reviews, description, active, created_at, updated_at';
const productCategories = ['Fashion', 'Mobiles', 'Electronics', 'Beauty', 'Home'];
const normalizeCategory = (value) => {
  const category = String(value || '').trim();
  return productCategories.find((item) => item.toLowerCase() === category.toLowerCase()) || category;
};

app.get('/healthz', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(503).json({ status: 'error' });
  }
});

app.get('/api/products', (req, res) => {
  const clauses = [];
  const values = [];
  if (req.query.category && req.query.category !== 'For You') {
    const category = normalizeCategory(req.query.category);
    if (!productCategories.includes(category)) return res.status(400).json({ error: 'Unsupported product category' });
    clauses.push('LOWER(TRIM(category)) = LOWER(?)'); values.push(category);
  }
  if (req.query.brand) { clauses.push('brand = ?'); values.push(req.query.brand); }
  if (req.query.q) {
    clauses.push('(name LIKE ? OR slug LIKE ? OR sku LIKE ? OR category LIKE ? OR brand LIKE ? OR description LIKE ?)');
    const query = `%${req.query.q}%`; values.push(query, query, query, query, query, query);
  }
  const numberFilter = (name, operator, field) => {
    if (req.query[name] !== undefined && req.query[name] !== '') {
      const value = Number(req.query[name]);
      if (!Number.isFinite(value)) throw fail(`${name} must be a number`);
      clauses.push(`${field} ${operator} ?`); values.push(value);
    }
  };
  numberFilter('min', '>=', 'price'); numberFilter('max', '<=', 'price'); numberFilter('minPrice', '>=', 'price'); numberFilter('maxPrice', '<=', 'price');
  numberFilter('minRating', '>=', 'rating');
  if (req.query.active !== undefined) {
    if (!['0', '1', 'true', 'false'].includes(String(req.query.active))) throw fail('active must be boolean');
    clauses.push('active = ?'); values.push(['1', 'true'].includes(String(req.query.active)) ? 1 : 0);
  }
  const sortMap = { price: 'price', rating: 'rating', reviews: 'reviews', name: 'name', newest: 'id' };
  const requestedSort = String(req.query.sort || 'id').toLowerCase();
  const sortField = sortMap[requestedSort.replace(/^-/, '')] || 'id';
  const direction = requestedSort.startsWith('-') || String(req.query.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const rows = db.prepare(`SELECT ${productFields} FROM products ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''} ORDER BY ${sortField} ${direction}, id`).all(...values);
  res.json({ products: rows });
});

const readProductBody = (body, partial = false) => {
  const fields = ['name', 'slug', 'sku', 'image_url', 'image_class', 'price', 'original_price', 'stock', 'category', 'brand', 'rating', 'reviews', 'description', 'active'];
  const result = {};
  fields.forEach((field) => { if (body[field] !== undefined) result[field] = body[field]; });
  if (!partial && (!result.name || !result.category || !result.brand || result.price === undefined)) {
    throw fail('name, category, brand and price are required');
  }
  if (result.category !== undefined) {
    result.category = normalizeCategory(result.category);
    if (!productCategories.includes(result.category)) throw fail(`category must be one of: ${productCategories.join(', ')}`);
  }
  ['price', 'original_price', 'stock', 'reviews'].forEach((field) => {
    if (result[field] !== undefined && result[field] !== null) result[field] = integer(result[field], field);
  });
  if (result.rating !== undefined && (!Number.isFinite(Number(result.rating)) || Number(result.rating) < 0 || Number(result.rating) > 5)) throw fail('rating must be between 0 and 5');
  if (result.active !== undefined) {
    const activeValue = String(result.active).trim().toLowerCase();
    result.active = ['1', 'true', 'yes', 'on'].includes(activeValue) ? 1 : 0;
  }
  return result;
};
app.get('/api/admin/products', requireAdmin, (req, res) => {
  const rows = db.prepare(`SELECT ${productFields} FROM products ORDER BY name ASC, id`).all();
  res.json({ products: rows });
});
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const stats = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM products WHERE active = 1) AS products,
      (SELECT COUNT(*) FROM users) AS users,
      COALESCE((SELECT SUM(total) FROM orders WHERE status != 'cancelled'), 0) AS sales
  `).get();
  const recentOrders = db.prepare(`
    SELECT o.id, o.status, o.total, o.created_at, u.name AS customer_name, u.email AS customer_email
    FROM orders o JOIN users u ON u.id = o.user_id
    ORDER BY o.id DESC LIMIT 8
  `).all();
  const topProducts = db.prepare(`
    SELECT oi.product_name AS name, SUM(oi.quantity) AS units,
      SUM(oi.quantity * oi.unit_price) AS revenue
    FROM order_items oi JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY units DESC, revenue DESC LIMIT 5
  `).all();
  res.json({ stats, recentOrders, topProducts });
});
app.post('/api/admin/products', requireAdmin, (req, res, next) => {
  try {
    const p = readProductBody(req.body || {});
    const fields = Object.keys(p); const placeholders = fields.map(() => '?').join(',');
    const result = db.prepare(`INSERT INTO products (${fields.join(',')}, updated_at) VALUES (${placeholders}, CURRENT_TIMESTAMP)`).run(...fields.map((f) => p[f]));
    res.status(201).json({ product: db.prepare(`SELECT ${productFields} FROM products WHERE id=?`).get(result.lastInsertRowid) });
  } catch (error) { next(error); }
});
app.put('/api/admin/products/:id', requireAdmin, (req, res, next) => {
  try {
    const p = readProductBody(req.body || {}, true); const fields = Object.keys(p);
    if (!fields.length) throw fail('No product fields supplied');
    const result = db.prepare(`UPDATE products SET ${fields.map((f) => `${f}=?`).join(',')}, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(...fields.map((f) => p[f]), req.params.id);
    if (!result.changes) throw fail('Product not found', 404);
    res.json({ product: db.prepare(`SELECT ${productFields} FROM products WHERE id=?`).get(req.params.id) });
  } catch (error) { next(error); }
});
app.delete('/api/admin/products/:id', requireAdmin, (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
    if (!result.changes) throw fail('Product not found', 404);
    res.status(204).end();
  } catch (error) { next(error); }
});

app.post('/api/auth/signup', (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!validName(name) || !validEmail(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      throw fail('name, email and a password of at least 8 characters are required');
    }
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
      String(name).trim(), String(email).trim().toLowerCase(), hashPassword(password)
    );
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ user, token: issueToken(user.id) });
  } catch (error) { next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('Email is already registered', 409) : error); }
});

app.post('/api/auth/login', (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = email && db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).trim().toLowerCase());
    if (!user || typeof password !== 'string' || !verifyPassword(password, user.password_hash)) {
      throw fail('Invalid email or password', 401);
    }
    res.json({ user: publicUser(user), token: issueToken(user.id) });
  } catch (error) { next(error); }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  const header = req.get('authorization') || '';
  const token = header.slice(7).trim();
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
  res.status(204).end();
});

const cartFields = `ci.product_id, ci.quantity, p.name, p.price, p.image_url,
  p.image_class, p.category, p.stock`;
const readCart = (userId) => db.prepare(`
  SELECT ${cartFields}
  FROM cart_items ci JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = ? AND p.active = 1
  ORDER BY ci.updated_at DESC, ci.product_id
`).all(userId);
const validCartItems = (items) => {
  if (!Array.isArray(items) || items.length > 100) throw fail('Cart items must be an array');
  const normalized = new Map();
  items.forEach((item) => {
    const productId = integer(item.product_id || item.productId, 'product_id');
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw fail('quantity must be between 1 and 99');
    }
    normalized.set(productId, quantity);
  });
  return [...normalized].map(([product_id, quantity]) => ({ product_id, quantity }));
};

app.get('/api/cart', requireAuth, (req, res) => {
  res.json({ items: readCart(req.user.id) });
});
app.put('/api/cart', requireAuth, (req, res, next) => {
  try {
    const items = validCartItems(req.body?.items);
    const getProduct = db.prepare('SELECT id, stock, active FROM products WHERE id = ?');
    const replaceCart = db.transaction(() => {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
      const insert = db.prepare(`
        INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `);
      items.forEach((item) => {
        const product = getProduct.get(item.product_id);
        if (!product || !product.active) throw fail('One or more cart products are unavailable', 404);
        if (product.stock < item.quantity) throw fail('Cart quantity exceeds available stock', 409);
        insert.run(req.user.id, item.product_id, item.quantity);
      });
    });
    replaceCart();
    res.json({ items: readCart(req.user.id) });
  } catch (error) { next(error); }
});

const readWishlist = (userId) => db.prepare(`
  SELECT wi.product_id, p.name, p.price, p.image_url, p.image_class,
    p.category, p.rating, p.reviews
  FROM wishlist_items wi JOIN products p ON p.id = wi.product_id
  WHERE wi.user_id = ? AND p.active = 1
  ORDER BY wi.created_at DESC, wi.product_id
`).all(userId);
const validWishlistItems = (items) => {
  if (!Array.isArray(items) || items.length > 100) throw fail('Wishlist items must be an array');
  const ids = new Set();
  items.forEach((item) => {
    const productId = integer(item.product_id || item.productId, 'product_id');
    ids.add(productId);
  });
  return [...ids];
};
app.get('/api/wishlist', requireAuth, (req, res) => {
  res.json({ items: readWishlist(req.user.id) });
});
app.put('/api/wishlist', requireAuth, (req, res, next) => {
  try {
    const productIds = validWishlistItems(req.body?.items);
    const getProduct = db.prepare('SELECT id, active FROM products WHERE id = ?');
    const replaceWishlist = db.transaction(() => {
      db.prepare('DELETE FROM wishlist_items WHERE user_id = ?').run(req.user.id);
      const insert = db.prepare('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)');
      productIds.forEach((productId) => {
        const product = getProduct.get(productId);
        if (!product || !product.active) throw fail('One or more wishlist products are unavailable', 404);
        insert.run(req.user.id, productId);
      });
    });
    replaceWishlist();
    res.json({ items: readWishlist(req.user.id) });
  } catch (error) { next(error); }
});

app.get('/api/addresses', requireAuth, (req, res) => {
  res.json({ addresses: db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC').all(req.user.id) });
});
app.post('/api/addresses', requireAuth, (req, res, next) => {
  try {
    const body = req.body || {};
    if (!validAddress(body)) throw fail('Please provide a valid address, mobile number and pincode');
    const result = db.prepare(`
      INSERT INTO addresses (user_id, label, name, mobile, line, pincode, city, state, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, body.label || 'Home', body.name, body.mobile, body.line, body.pincode, body.city || null, body.state || null, body.country || 'India');
    res.status(201).json({ address: db.prepare('SELECT * FROM addresses WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) { next(error); }
});
app.put('/api/addresses/:id', requireAuth, (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) throw fail('Address not found', 404);
    const body = { ...existing, ...(req.body || {}) };
    if (!validAddress(body)) throw fail('Please provide a valid address, mobile number and pincode');
    db.prepare(`
      UPDATE addresses SET label=?, name=?, mobile=?, line=?, pincode=?, city=?, state=?, country=?
      WHERE id=? AND user_id=?
    `).run(body.label, body.name, body.mobile, body.line, body.pincode, body.city || null, body.state || null, body.country || 'India', existing.id, req.user.id);
    res.json({ address: db.prepare('SELECT * FROM addresses WHERE id = ?').get(existing.id) });
  } catch (error) { next(error); }
});
app.delete('/api/addresses/:id', requireAuth, (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (!result.changes) throw fail('Address not found', 404);
    res.status(204).end();
  } catch (error) { next(error); }
});

const orderRows = (userId) => db.prepare(`
  SELECT o.*, json_group_array(json_object('id', oi.id, 'product_id', oi.product_id,
    'product_name', oi.product_name, 'unit_price', oi.unit_price, 'quantity', oi.quantity,
    'image_url', oi.image_url, 'image_class', oi.image_class, 'category', oi.category)) AS items
  FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
  WHERE o.user_id = ? GROUP BY o.id ORDER BY o.id DESC
`).all(userId).map((order) => ({ ...order, items: JSON.parse(order.items) }));
app.get('/api/orders', requireAuth, (req, res) => res.json({ orders: orderRows(req.user.id) }));
app.post('/api/orders', requireAuth, (req, res, next) => {
  try {
    const { items, address_id: addressId, address, coupon, payment_method: paymentMethod = 'upi' } = req.body || {};
    if (!['upi', 'card', 'cod'].includes(paymentMethod)) throw fail('Unsupported payment method');
    if (!Array.isArray(items) || !items.length) throw fail('At least one order item is required');
    let resolvedAddressId = addressId || null;
    if (resolvedAddressId && !db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(resolvedAddressId, req.user.id)) {
      throw fail('Address not found', 404);
    }
    if (!resolvedAddressId) {
      if (!validAddress({ ...(address || {}), label: address?.label || 'Home' })) {
        throw fail('A valid delivery address is required');
      }
    }
    const normalizedMap = new Map();
    items.map((item) => ({ productId: integer(item.product_id || item.productId, 'product_id'), quantity: integer(item.quantity, 'quantity') }))
      .forEach((item) => {
        if (!item.quantity || item.quantity > 99) throw fail('quantity must be between 1 and 99');
        normalizedMap.set(item.productId, (normalizedMap.get(item.productId) || 0) + item.quantity);
      });
    const normalized = [...normalizedMap.entries()].map(([productId, quantity]) => ({ productId, quantity }));
    const getProduct = db.prepare('SELECT id, name, price, stock, image_url, image_class, category FROM products WHERE id = ?');
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ?, updated_at=CURRENT_TIMESTAMP WHERE id = ? AND stock >= ?');
    const createOrder = db.transaction(() => {
      const products = normalized.map((item) => ({ ...item, product: getProduct.get(item.productId) }));
      if (products.some((item) => !item.product)) throw fail('One or more products do not exist', 404);
      products.forEach((item) => {
        if (item.product.stock < item.quantity || !decrementStock.run(item.quantity, item.product.id, item.quantity).changes) {
          throw fail(`Insufficient stock for ${item.product.name}`, 409);
        }
      });
      const subtotal = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const deliveryFee = subtotal > 0 ? 40 : 0;
      const discount = coupon === 'SAVE100' && subtotal >= 999
        ? 100
        : coupon === 'BANK10'
          ? Math.round(subtotal * 0.1)
          : coupon === 'FREEDEL' ? deliveryFee : 0;
      const total = subtotal + deliveryFee - discount;
      let orderAddress = resolvedAddressId
        ? db.prepare('SELECT name, mobile, line, pincode FROM addresses WHERE id = ? AND user_id = ?').get(resolvedAddressId, req.user.id)
        : null;
      if (!resolvedAddressId) {
        const savedAddress = db.prepare(`
          INSERT INTO addresses (user_id, label, name, mobile, line, pincode)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(req.user.id, address.label || 'Home', address.name.trim(), address.mobile, address.line.trim(), address.pincode);
        resolvedAddressId = savedAddress.lastInsertRowid;
        orderAddress = {
          name: address.name.trim(),
          mobile: address.mobile,
          line: address.line.trim(),
          pincode: address.pincode
        };
      }
      const order = db.prepare(`INSERT INTO orders
        (user_id, address_id, status, subtotal, delivery_fee, discount, payment_method, address_name, address_mobile, address_line, address_pincode, total)
        VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        req.user.id, resolvedAddressId, subtotal, deliveryFee, discount, paymentMethod,
        orderAddress.name, orderAddress.mobile, orderAddress.line, orderAddress.pincode, total
      );
      const addItem = db.prepare(`INSERT INTO order_items
        (order_id, product_id, product_name, unit_price, quantity, image_url, image_class, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      products.forEach((item) => addItem.run(order.lastInsertRowid, item.product.id, item.product.name, item.product.price,
        item.quantity, item.product.image_url, item.product.image_class, item.product.category));
      return order.lastInsertRowid;
    })();
    res.status(201).json({ order: orderRows(req.user.id).find((order) => order.id === createOrder) });
  } catch (error) { next(error); }
});

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(publicFile));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : error.message });
});

if (require.main === module) app.listen(port, () => console.log(`Nexora server listening on port ${port}`));
module.exports = app;
