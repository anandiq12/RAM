const validateStartupEnvironment = (environment = process.env) => {
  const adminKey = environment.ADMIN_KEY;
  if (typeof adminKey !== 'string' || !adminKey.trim()) {
    throw new Error('Required environment variable ADMIN_KEY is missing. Set it in your shell or hosting provider settings before starting the server.');
  }
  if (adminKey !== adminKey.trim()) {
    throw new Error('ADMIN_KEY must not contain leading or trailing whitespace.');
  }
  if (Buffer.byteLength(adminKey, 'utf8') < 32) {
    throw new Error('ADMIN_KEY must be at least 32 characters. Generate a cryptographically random key instead of using a placeholder.');
  }
};

if (require.main === module) {
  try {
    validateStartupEnvironment();
  } catch (error) {
    console.error(`Startup configuration error: ${error.message}`);
    process.exit(1);
  }
}

const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const ExcelJS = require('exceljs');
const { parse: parseCsv } = require('csv-parse/sync');
const db = require('./db');

const configuredDatabasePath = process.env.DATABASE_PATH || path.join(__dirname, 'nexora.sqlite');
const normalizedDatabasePath = path.resolve(configuredDatabasePath);
const normalizedTemporaryPath = path.resolve(os.tmpdir());
const databaseUsesTemporaryStorage = configuredDatabasePath === ':memory:'
  || normalizedDatabasePath === normalizedTemporaryPath
  || normalizedDatabasePath.startsWith(`${normalizedTemporaryPath}${path.sep}`);
const databaseMarkedDurable = process.env.DATABASE_DURABLE === 'true' && !databaseUsesTemporaryStorage;
const productionStorageReady = process.env.NODE_ENV !== 'production' || databaseMarkedDurable;
if (require.main === module && process.env.NODE_ENV === 'production' && !productionStorageReady) {
  console.warn('Production storage is not marked durable. Live payments and cash-on-delivery remain disabled until a persistent database path is configured and DATABASE_DURABLE=true.');
}

const app = express();
const port = Number(process.env.PORT) || 3000;
const sellerUploadRoot = process.env.SELLER_UPLOAD_DIR || path.join(__dirname, 'assets', 'uploads', 'sellers');
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});
const supplierFeedRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Supplier feed rate limit exceeded. Retry in 15 minutes.' }
});
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buffer) => {
    if (['/api/payments/razorpay/webhook', '/api/shipping/webhook'].includes(req.path)) req.rawBody = buffer;
  }
}));
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

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
  mobile: user.mobile || '',
  created_at: user.created_at
});
const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  error.expose = true;
  return error;
};
const razorpaySettings = () => {
  const mode = process.env.RAZORPAY_MODE || 'test';
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const prefix = mode === 'live' ? 'rzp_live_' : 'rzp_test_';
  const enabled = ['test', 'live'].includes(mode)
    && keyId.startsWith(prefix)
    && Boolean(keySecret)
    && (mode !== 'live' || (Boolean(webhookSecret) && productionStorageReady && process.env.NODE_ENV === 'production'));
  return { mode, keyId, keySecret, webhookSecret, enabled };
};
const razorpayRequest = async (method, endpoint, body) => {
  const { keyId, keySecret } = razorpaySettings();
  let response;
  try {
    response = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
  } catch (error) {
    throw fail('Payment provider is unreachable. Please try again.', 502);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Razorpay API request failed', response.status, payload.error?.code || 'unknown');
    throw fail('Payment provider could not complete the request. Please try again.', 502);
  }
  return payload;
};
const safeSignatureEqual = (expected, supplied) => {
  if (typeof supplied !== 'string' || !/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const expectedBuffer = Buffer.from(expected, 'hex');
  const suppliedBuffer = Buffer.from(supplied, 'hex');
  return expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
};
const applyCapturedPayment = (orderId, paymentId) => {
  const update = db.transaction(() => {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order || order.payment_method !== 'razorpay') throw fail('Payment order not found', 404);
    if (order.payment_status === 'captured') {
      if (order.razorpay_payment_id !== paymentId) {
        console.error('A second captured payment requires manual review for order', orderId);
      }
      return order;
    }
    if (order.payment_status === 'paid_stock_issue') return order;
    const items = db.prepare(`
      SELECT oi.product_id, oi.quantity, p.stock, p.active
      FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `).all(orderId);
    const unavailable = !items.length || items.some((item) => !item.product_id
      || !item.active || item.stock < item.quantity);
    if (unavailable || order.status === 'cancelled') {
      db.prepare(`UPDATE orders SET payment_status = 'paid_stock_issue',
        razorpay_payment_id = ?, status = 'payment_issue' WHERE id = ?`).run(paymentId, orderId);
      return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    }
    const reduceStock = db.prepare(`
      UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND active = 1 AND stock >= ?
    `);
    for (const item of items) {
      if (!reduceStock.run(item.quantity, item.product_id, item.quantity).changes) {
        db.prepare(`UPDATE orders SET payment_status = 'paid_stock_issue',
          razorpay_payment_id = ?, status = 'payment_issue' WHERE id = ?`).run(paymentId, orderId);
        return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      }
    }
    db.prepare(`UPDATE orders SET payment_status = 'captured', razorpay_payment_id = ?,
      status = 'pending' WHERE id = ?`).run(paymentId, orderId);
    return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  });
  return update();
};
const requireAuth = (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const session = token && db.prepare(`
    SELECT u.id, u.name, u.email, u.mobile, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
  `).get(tokenHash(token));
  if (!session) return res.status(401).json({ error: 'Authentication required' });
  req.user = session;
  next();
};
const requireApprovedSeller = (req, res, next) => {
  const seller = db.prepare('SELECT * FROM seller_accounts WHERE user_id = ?').get(req.user.id);
  if (!seller || seller.status !== 'approved') {
    return res.status(403).json({ error: seller ? `Seller account is ${seller.status}. Product management requires approval.` : 'Submit a seller application before managing products.' });
  }
  req.seller = seller;
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
const createInAppNotification = (userId, type, title, message) => {
  const preference = type === 'offer' ? 'offers' : type === 'message' ? 'messages' : 'orders';
  db.prepare('INSERT OR IGNORE INTO notification_preferences (user_id) VALUES (?)').run(userId);
  const enabled = db.prepare(`SELECT ${preference} AS enabled FROM notification_preferences WHERE user_id = ?`)
    .get(userId)?.enabled;
  if (!enabled) return null;
  const result = db.prepare(`
    INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)
  `).run(userId, type, title, message);
  return db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?')
    .get(result.lastInsertRowid, userId);
};
const sendTransactionalEmail = async ({ to, subject, text, html }) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!apiKey || !from) {
    console.info('Transactional email not sent: configure SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.');
    return { sent: false, reason: 'not_configured' };
  }
  let response;
  try {
    response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: 'text/plain', value: text }, { type: 'text/html', value: html }]
      })
    });
  } catch (error) {
    console.error('SendGrid request failed', error.message);
    return { sent: false, reason: 'provider_unreachable' };
  }
  if (!response.ok) {
    const requestId = response.headers.get('x-message-id') || 'unavailable';
    console.error('SendGrid rejected transactional email', response.status, requestId);
    return { sent: false, reason: 'provider_rejected' };
  }
  return { sent: true };
};
const codFreeShippingThreshold = Number(process.env.COD_FREE_SHIPPING_THRESHOLD || 899);
if (!Number.isSafeInteger(codFreeShippingThreshold) || codFreeShippingThreshold < 0) {
  throw new Error('COD_FREE_SHIPPING_THRESHOLD must be a non-negative integer amount in rupees');
}
const codEnabled = process.env.NODE_ENV === 'production'
  ? process.env.COD_ENABLED === 'true' && productionStorageReady
  : process.env.COD_ENABLED !== 'false';
const shippingTrackingRequired = process.env.NODE_ENV === 'production'
  || process.env.SHIPPING_TRACKING_REQUIRED === 'true';
const productFields = 'id, name, slug, sku, image_url, images_json, image_class, price, original_price, stock, popularity, category, subcategory, brand, product_type, model, variants_json, specifications_json, seller, delivery_information, rating, reviews, description, active, created_at, updated_at';
const productCategories = () => db.prepare("SELECT name FROM catalog_nodes WHERE kind = 'category' ORDER BY name COLLATE NOCASE").all().map((row) => row.name);
const normalizeCategory = (value) => {
  const category = String(value || '').trim();
  const aliases = {
    home: 'Home & Kitchen',
    beauty: 'Beauty & Personal Care',
    food: 'Grocery',
    toys: 'Toys & Games',
    sports: 'Sports & Fitness',
    '2 wheelers': 'Automotive'
  };
  return productCategories().find((item) => item.toLowerCase() === category.toLowerCase())
    || aliases[category.toLowerCase()]
    || category;
};

app.get('/healthz', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({
      status: 'ok',
      database: { engine: 'sqlite', durable: databaseMarkedDurable }
    });
  } catch (error) {
    res.status(503).json({ status: 'error' });
  }
});

app.get('/api/payments/razorpay/config', (req, res) => {
  const settings = razorpaySettings();
  res.json({
    enabled: settings.enabled && (settings.mode !== 'live' || req.secure),
    cod_enabled: codEnabled,
    mode: settings.mode === 'live' ? 'live' : 'test',
    key_id: settings.enabled ? settings.keyId : null
  });
});

app.post('/api/payments/razorpay/webhook', (req, res) => {
  const { webhookSecret } = razorpaySettings();
  const signature = req.get('x-razorpay-signature') || '';
  if (!webhookSecret || !Buffer.isBuffer(req.rawBody)) return res.status(503).json({ error: 'Payment webhook is not configured' });
  const expected = crypto.createHmac('sha256', webhookSecret).update(req.rawBody).digest('hex');
  if (!safeSignatureEqual(expected, signature)) return res.status(401).json({ error: 'Invalid payment webhook signature' });
  try {
    const event = JSON.parse(req.rawBody.toString('utf8'));
    const payment = event.payload?.payment?.entity;
    if (event.event === 'payment.captured' && payment?.id && payment?.order_id) {
      const order = db.prepare('SELECT id, total FROM orders WHERE razorpay_order_id = ?').get(payment.order_id);
      if (!order) throw fail('Payment order not found', 404);
      if (payment.amount !== order.total * 100 || payment.currency !== 'INR') {
        throw fail('Payment amount does not match the order', 409);
      }
      applyCapturedPayment(order.id, payment.id);
    } else if (event.event === 'payment.failed' && payment?.order_id) {
      db.prepare(`UPDATE orders SET payment_status = 'failed', status = 'payment_failed'
        WHERE razorpay_order_id = ? AND payment_status = 'created'`)
        .run(payment.order_id);
    }
    res.json({ received: true });
  } catch (error) {
    if (error.status >= 500) console.error(error);
    res.status(error.status || 400).json({ error: error.status ? error.message : 'Invalid payment webhook payload' });
  }
});

let productFacetsCache = null;
const productFacetsCacheDuration = 30_000;
app.get('/api/products/facets', (req, res) => {
  const isFresh = (etag) => (req.get('If-None-Match') || '').split(',')
    .some((value) => value.trim() === '*' || value.trim().replace(/^W\//, '') === etag.replace(/^W\//, ''));
  if (productFacetsCache && productFacetsCache.expiresAt > Date.now()) {
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.set('ETag', productFacetsCache.etag);
    if (isFresh(productFacetsCache.etag)) return res.status(304).end();
    return res.type('json').send(productFacetsCache.body);
  }
  const namesByKind = (kind) => db.prepare(`
    SELECT DISTINCT name FROM catalog_nodes WHERE kind = ? ORDER BY name COLLATE NOCASE
  `).all(kind).map((row) => row.name);
  const categories = namesByKind('category');
  const subcategories = namesByKind('subcategory');
  const brands = namesByKind('brand');
  const rows = db.prepare(`
    SELECT id, kind, parent_id, name FROM catalog_nodes
    ORDER BY name COLLATE NOCASE, id
  `).all();
  const catalogById = new Map();
  rows.forEach((row) => catalogById.set(row.id, {
    name: row.name,
    ...(row.kind === 'category' ? { subcategories: [] } : {}),
    ...(row.kind === 'subcategory' ? { brands: [] } : {}),
    ...(row.kind === 'brand' ? { product_types: [] } : {}),
    ...(row.kind === 'product_type' ? { models: [] } : {})
  }));
  rows.forEach((row) => {
    const node = catalogById.get(row.id);
    if (row.kind === 'category') return;
    const parent = catalogById.get(row.parent_id);
    if (!parent) return;
    const childKey = {
      subcategory: 'subcategories',
      brand: 'brands',
      product_type: 'product_types',
      model: 'models'
    }[row.kind];
    if (childKey) parent[childKey].push(node);
  });
  const facets = {
    categories,
    subcategories,
    brands,
    catalog: rows.filter((row) => row.kind === 'category').map((row) => catalogById.get(row.id))
  };
  const body = JSON.stringify(facets);
  productFacetsCache = {
    body,
    etag: `"${crypto.createHash('sha256').update(body).digest('base64url')}"`,
    expiresAt: Date.now() + productFacetsCacheDuration
  };
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  res.set('ETag', productFacetsCache.etag);
  if (isFresh(productFacetsCache.etag)) return res.status(304).end();
  return res.type('json').send(body);
});

app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'no-store');
  const clauses = [];
  const values = [];
  if (req.query.id !== undefined) {
    const rawIds = [].concat(req.query.id);
    if (!rawIds.length || rawIds.length > 100
      || rawIds.some((id) => !/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) < 1)) {
      throw fail('id must contain up to 100 positive product IDs');
    }
    const ids = [...new Set(rawIds.map(Number))];
    clauses.push(`id IN (${ids.map(() => '?').join(', ')})`);
    values.push(...ids);
  }
  const categories = [].concat(req.query.category || []).filter((value) => value && value !== 'For You');
  if (categories.length) {
    const normalized = categories.map(normalizeCategory);
    const supported = productCategories();
    if (normalized.some((category) => !supported.some((item) => item.toLowerCase() === category.toLowerCase()))) {
      return res.status(400).json({ error: 'Unsupported product category' });
    }
    clauses.push(`LOWER(TRIM(category)) IN (${normalized.map(() => 'LOWER(?)').join(', ')})`);
    values.push(...normalized);
  }
  const hierarchyFields = {
    subcategory: "COALESCE(NULLIF(TRIM(subcategory), ''), 'General')",
    product_type: "COALESCE(NULLIF(TRIM(product_type), ''), 'General')",
    model: "COALESCE(NULLIF(TRIM(model), ''), name)"
  };
  Object.entries(hierarchyFields).forEach(([field, expression]) => {
    const selected = [].concat(req.query[field] || []).filter(Boolean).map((value) => String(value).trim());
    if (selected.length) {
      clauses.push(`LOWER(${expression}) IN (${selected.map(() => 'LOWER(?)').join(', ')})`);
      values.push(...selected);
    }
  });
  const brands = [].concat(req.query.brand || []).filter(Boolean).map((value) => String(value).trim());
  if (brands.length) {
    clauses.push(`LOWER(brand) IN (${brands.map(() => 'LOWER(?)').join(', ')})`);
    values.push(...brands);
  }
  if (req.query.q) {
    const query = String(req.query.q).trim();
    if (query.length > 200) throw fail('q must be 200 characters or fewer');
    const tokens = query.match(/[\p{L}\p{N}]+/gu) || [];
    if (!tokens.length) {
      clauses.push('0');
    } else {
      const ftsQuery = tokens.map((token) => `"${token.replace(/"/g, '""')}"*`).join(' AND ');
      clauses.push('products.id IN (SELECT rowid FROM products_fts WHERE products_fts MATCH ?)');
      values.push(ftsQuery);
    }
  }
  const numberFilter = (name, operator, field, aliases = []) => {
    const input = [name, ...aliases].find((key) => req.query[key] !== undefined && req.query[key] !== '');
    if (input === undefined) return;
    const value = Number(req.query[input]);
    if (!Number.isFinite(value) || value < 0) throw fail(`${input} must be a non-negative number`);
    clauses.push(`${field} ${operator} ?`); values.push(value);
  };
  const discountExpression = '(CASE WHEN original_price > price AND original_price > 0 THEN ((original_price - price) * 100.0 / original_price) ELSE 0 END)';
  numberFilter('minPrice', '>=', 'price', ['min']);
  numberFilter('maxPrice', '<=', 'price', ['max']);
  numberFilter('minRating', '>=', 'rating');
  numberFilter('minDiscount', '>=', discountExpression, ['discount']);
  if (req.query.onDiscount === 'true' || req.query.onDiscount === '1') clauses.push(`${discountExpression} > 0`);
  if (req.query.inStock !== undefined && req.query.inStock !== '') {
    if (!['0', '1', 'true', 'false'].includes(String(req.query.inStock))) throw fail('inStock must be boolean');
    clauses.push(['1', 'true'].includes(String(req.query.inStock)) ? 'stock > 0' : 'stock = 0');
  }
  if (req.query.availability !== undefined && !['all', 'in-stock', 'out-of-stock'].includes(String(req.query.availability))) {
    throw fail('availability must be all, in-stock or out-of-stock');
  }
  if (req.query.availability === 'in-stock') clauses.push('stock > 0');
  if (req.query.availability === 'out-of-stock') clauses.push('stock = 0');
  if (req.query.active !== undefined) {
    if (!['0', '1', 'true', 'false'].includes(String(req.query.active))) throw fail('active must be boolean');
    if (['0', 'false'].includes(String(req.query.active))) {
      throw fail('Inactive products are not available through the public catalog');
    }
  }
  clauses.push('active = 1');
  const parsePageNumber = (name, fallback, maximum) => {
    const value = req.query[name] === undefined ? fallback : Number(req.query[name]);
    if (!Number.isInteger(value) || value < 0 || value > maximum) throw fail(`${name} must be an integer between 0 and ${maximum}`);
    return value;
  };
  const limit = parsePageNumber('limit', 24, 100);
  if (limit < 1) throw fail('limit must be at least 1');
  const offset = parsePageNumber('offset', 0, 10000000);
  const sortMap = {
    price: 'price',
    rating: 'rating',
    reviews: 'reviews',
    name: 'name COLLATE NOCASE',
    newest: 'created_at',
    popularity: 'popularity'
  };
  const requestedSort = String(req.query.sort || '-newest').toLowerCase();
  const sortField = sortMap[requestedSort.replace(/^-/, '')];
  if (!sortField) throw fail('sort must be price, rating, reviews, name, newest or popularity');
  const direction = requestedSort.startsWith('-') || String(req.query.order || '').toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const cursorRequested = req.query.cursor !== undefined;
  if (cursorRequested && offset !== 0) throw fail('offset cannot be combined with cursor pagination');
  let cursor = null;
  if (cursorRequested && req.query.cursor !== 'start') {
    const encodedCursor = String(req.query.cursor);
    if (encodedCursor.length > 2048) throw fail('cursor is too long');
    try {
      cursor = JSON.parse(Buffer.from(encodedCursor, 'base64url').toString('utf8'));
    } catch {
      throw fail('cursor is invalid');
    }
    if (!cursor || cursor.sort !== requestedSort || !Number.isSafeInteger(cursor.id) || cursor.id < 1
      || (['price', 'rating', 'reviews', 'popularity'].includes(requestedSort.replace(/^-/, ''))
        ? !Number.isFinite(cursor.value)
        : typeof cursor.value !== 'string')) {
      throw fail('cursor does not match the requested sort order');
    }
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const total = cursorRequested
    ? null
    : db.prepare(`SELECT COUNT(*) AS total FROM products ${where}`).get(...values).total;
  const pageClauses = [...clauses];
  const pageValues = [...values];
  if (cursor) {
    const comparator = direction === 'ASC' ? '>' : '<';
    pageClauses.push(`(${sortField} ${comparator} ? OR (${sortField} = ? AND id < ?))`);
    pageValues.push(cursor.value, cursor.value, cursor.id);
  }
  const pageWhere = pageClauses.length ? `WHERE ${pageClauses.join(' AND ')}` : '';
  const rows = db.prepare(`
    SELECT ${productFields},
      ${sortField} AS __cursor_value,
      CASE WHEN original_price > price AND original_price > 0
        THEN ROUND((original_price - price) * 100.0 / original_price, 1) ELSE 0 END AS discount_percent
    FROM products ${pageWhere}
    ORDER BY ${sortField} ${direction}, id DESC
    LIMIT ? OFFSET ?
  `).all(...pageValues, limit + 1, cursorRequested ? 0 : offset);
  const hasMore = rows.length > limit;
  const pageRows = rows.slice(0, limit);
  const last = pageRows[pageRows.length - 1];
  const nextCursor = cursorRequested && hasMore && last
    ? Buffer.from(JSON.stringify({ sort: requestedSort, value: last.__cursor_value, id: last.id })).toString('base64url')
    : null;
  pageRows.forEach((row) => { delete row.__cursor_value; });
  res.json({
    products: pageRows,
    pagination: {
      total,
      limit,
      ...(cursorRequested ? { cursor: req.query.cursor, nextCursor } : { offset }),
      hasMore
    }
  });
});

app.get('/api/products/:productId/reviews', (req, res, next) => {
  try {
    const productId = integer(req.params.productId, 'productId');
    const product = db.prepare('SELECT id FROM products WHERE id = ? AND active = 1').get(productId);
    if (!product) throw fail('Product not found', 404);
    const summary = db.prepare(`
      SELECT COUNT(*) AS count, ROUND(AVG(rating), 1) AS average
      FROM product_reviews WHERE product_id = ?
    `).get(productId);
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.title, r.body, r.created_at
      FROM product_reviews r
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT 50
    `).all(productId);
    res.json({
      summary: { count: summary.count, average: summary.average || 0 },
      reviews: reviews.map((review) => ({ ...review, verified_purchase: true }))
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:productId/reviews/eligibility', requireAuth, (req, res, next) => {
  try {
    const productId = integer(req.params.productId, 'productId');
    const product = db.prepare('SELECT id FROM products WHERE id = ? AND active = 1').get(productId);
    if (!product) throw fail('Product not found', 404);
    const purchases = db.prepare(`
      SELECT oi.id AS order_item_id, o.created_at AS ordered_at, oi.delivered_at
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.user_id = ? AND oi.product_id = ? AND oi.fulfillment_status = 'delivered'
        AND o.payment_method IN ('cod', 'razorpay')
        AND (o.payment_method != 'razorpay' OR o.payment_status = 'captured')
        AND NOT EXISTS (
          SELECT 1 FROM product_reviews r WHERE r.order_item_id = oi.id
        )
      ORDER BY oi.delivered_at DESC, oi.id DESC
    `).all(req.user.id, productId);
    res.json({ eligible_purchases: purchases });
  } catch (error) {
    next(error);
  }
});

app.post('/api/products/:productId/reviews', requireAuth, (req, res, next) => {
  try {
    const productId = integer(req.params.productId, 'productId');
    const { order_item_id: orderItemId, rating, title, body } = req.body || {};
    const parsedOrderItemId = integer(orderItemId, 'order_item_id');
    const parsedRating = Number(rating);
    if (!Number.isSafeInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw fail('Rating must be a whole number from 1 to 5');
    }
    if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
      throw fail('Review title must be between 3 and 100 characters');
    }
    if (typeof body !== 'string' || body.trim().length < 10 || body.trim().length > 2000) {
      throw fail('Review must be between 10 and 2,000 characters');
    }

    const saveReview = db.transaction(() => {
      const purchase = db.prepare(`
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE oi.id = ? AND oi.product_id = ? AND o.user_id = ?
          AND oi.fulfillment_status = 'delivered' AND p.active = 1
          AND o.payment_method IN ('cod', 'razorpay')
          AND (o.payment_method != 'razorpay' OR o.payment_status = 'captured')
      `).get(parsedOrderItemId, productId, req.user.id);
      if (!purchase) throw fail('A delivered purchase of this product is required to review it', 403);
      if (db.prepare('SELECT 1 FROM product_reviews WHERE order_item_id = ?').get(parsedOrderItemId)) {
        throw fail('This purchase has already been reviewed', 409);
      }

      const result = db.prepare(`
        INSERT INTO product_reviews (product_id, user_id, order_item_id, rating, title, body)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(productId, req.user.id, parsedOrderItemId, parsedRating, title.trim(), body.trim());
      const summary = db.prepare(`
        SELECT COUNT(*) AS count, ROUND(AVG(rating), 1) AS average
        FROM product_reviews WHERE product_id = ?
      `).get(productId);
      db.prepare(`
        UPDATE products SET rating = ?, reviews = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(summary.average || 0, summary.count, productId);
      return {
        review: db.prepare(`
          SELECT id, rating, title, body, created_at
          FROM product_reviews WHERE id = ?
        `).get(result.lastInsertRowid),
        summary
      };
    });

    const saved = saveReview();
    res.status(201).json({
      review: { ...saved.review, verified_purchase: true },
      summary: { count: saved.summary.count, average: saved.summary.average || 0 }
    });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE'
      ? fail('This purchase has already been reviewed', 409)
      : error);
  }
});

const readProductBody = (body, partial = false) => {
  const fields = ['name', 'slug', 'sku', 'image_url', 'images_json', 'image_class', 'price', 'original_price', 'stock', 'category', 'subcategory', 'brand', 'product_type', 'model', 'variants_json', 'specifications_json', 'seller', 'delivery_information', 'rating', 'reviews', 'description', 'active'];
  const result = {};
  fields.forEach((field) => { if (body[field] !== undefined) result[field] = body[field]; });
  if (!partial && (!result.name || !result.category || !result.brand || result.price === undefined)) {
    throw fail('name, category, brand and price are required');
  }
  if (result.category !== undefined) {
    result.category = normalizeCategory(result.category);
    if (!productCategories().includes(result.category)) throw fail(`category must be one of: ${productCategories().join(', ')}`);
  }
  ['subcategory', 'product_type', 'model', 'brand', 'seller', 'delivery_information', 'description', 'name', 'sku', 'slug', 'image_url', 'image_class'].forEach((field) => {
    if (result[field] !== undefined) {
      if (typeof result[field] !== 'string') throw fail(`${field} must be text`);
      result[field] = result[field].trim();
      if (result[field].length > (field === 'description' ? 5000 : 240)) throw fail(`${field} is too long`);
    }
  });
  if (result.image_url !== undefined && result.image_url !== null && result.image_url !== ''
    && (result.image_url.length > 2048 || (!/^https?:\/\/\S+$/i.test(result.image_url) && !/^\/assets\/uploads\/sellers\/\d+\/[a-f0-9]{32}\.(?:png|jpg|webp)$/i.test(result.image_url)))) {
    throw fail('image_url must be an HTTP(S) URL or a seller-uploaded image path');
  }
  if (result.images_json !== undefined) {
    let images;
    try {
      images = typeof result.images_json === 'string' ? JSON.parse(result.images_json) : result.images_json;
    } catch {
      throw fail('images_json must be a JSON array of image URLs');
    }
    const validImageUrl = (url) => typeof url === 'string' && url.length <= 2048
      && (/^https?:\/\/\S+$/i.test(url) || /^\/assets\/uploads\/sellers\/\d+\/[a-f0-9]{32}\.(?:png|jpg|webp)$/i.test(url));
    if (!Array.isArray(images) || images.length > 10 || images.some((url) => !validImageUrl(url))) {
      throw fail('images_json must contain up to 10 HTTP(S) URLs or seller-uploaded image paths');
    }
    result.images_json = JSON.stringify(images);
    if (result.image_url === undefined) result.image_url = images[0] || null;
  }
  if (result.variants_json !== undefined) {
    let variants;
    try {
      variants = typeof result.variants_json === 'string' ? JSON.parse(result.variants_json) : result.variants_json;
    } catch {
      throw fail('variants_json must be a JSON object containing variant arrays');
    }
    if (!variants || typeof variants !== 'object' || Array.isArray(variants)
      || Object.entries(variants).length > 30
      || Object.entries(variants).some(([key, values]) => !/^[a-z][a-z0-9_ -]{0,39}$/i.test(key) || !Array.isArray(values) || values.length > 50 || values.some((value) => typeof value !== 'string' || value.length > 80))) {
      throw fail('variants_json must contain up to 30 named arrays, each with up to 50 text values');
    }
    result.variants_json = JSON.stringify(variants);
  }
  if (result.specifications_json !== undefined) {
    let specifications;
    try {
      specifications = typeof result.specifications_json === 'string'
        ? JSON.parse(result.specifications_json)
        : result.specifications_json;
    } catch {
      throw fail('specifications_json must be a JSON object of product specifications');
    }
    if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)
      || Object.entries(specifications).length > 50
      || Object.entries(specifications).some(([key, value]) => !key.trim() || key.length > 80
        || !['string', 'number', 'boolean'].includes(typeof value)
        || String(value).length > 500)) {
      throw fail('specifications_json must contain up to 50 named specifications with text, number or boolean values');
    }
    result.specifications_json = JSON.stringify(Object.fromEntries(
      Object.entries(specifications).map(([key, value]) => [key.trim(), value])
    ));
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
const catalogNodeKinds = ['category', 'subcategory', 'brand', 'product_type', 'model'];
const catalogProductFields = {
  category: "category",
  subcategory: "COALESCE(NULLIF(subcategory, ''), 'General')",
  brand: "COALESCE(NULLIF(brand, ''), 'Unbranded')",
  product_type: "COALESCE(NULLIF(product_type, ''), 'General')",
  model: "COALESCE(NULLIF(model, ''), name)"
};
const catalogNodePath = (node) => {
  const path = [node];
  let parentId = node.parent_id;
  while (parentId) {
    const parent = db.prepare('SELECT id, kind, parent_id, name FROM catalog_nodes WHERE id = ?').get(parentId);
    if (!parent) throw fail('Catalog parent not found', 404);
    path.unshift(parent);
    parentId = parent.parent_id;
  }
  return path;
};
const catalogProductScope = (path) => {
  const clauses = [];
  const values = [];
  path.forEach((node) => {
    const field = catalogProductFields[node.kind];
    if (!field) return;
    clauses.push(`${field} = ? COLLATE NOCASE`);
    values.push(node.name);
  });
  return { clause: clauses.join(' AND '), values };
};
const insertCatalogNode = db.prepare('INSERT OR IGNORE INTO catalog_nodes (kind, parent_id, name) VALUES (?, ?, ?)');
const findCatalogNode = db.prepare('SELECT id FROM catalog_nodes WHERE kind = ? AND COALESCE(parent_id, 0) = COALESCE(?, 0) AND name = ? COLLATE NOCASE');
const syncProductCatalogNodes = (product) => {
  const ensure = (kind, parentId, name) => {
    insertCatalogNode.run(kind, parentId, name);
    return findCatalogNode.get(kind, parentId, name).id;
  };
  const categoryId = ensure('category', null, product.category);
  const subcategoryId = ensure('subcategory', categoryId, product.subcategory || 'General');
  const brandId = ensure('brand', subcategoryId, product.brand || 'Unbranded');
  const typeId = ensure('product_type', brandId, product.product_type || 'General');
  ensure('model', typeId, product.model || product.name);
};
const readCatalogNodeBody = (body, partial = false) => {
  const kind = String(body.kind || '').trim();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const parentId = body.parent_id === null || body.parent_id === '' || body.parent_id === undefined
    ? null
    : Number(body.parent_id);
  if (!partial && !catalogNodeKinds.includes(kind)) throw fail('kind must be a valid catalog level');
  if (body.kind !== undefined && !catalogNodeKinds.includes(kind)) throw fail('kind must be a valid catalog level');
  if (!partial && (!name || name.length > 120)) throw fail('name must be between 1 and 120 characters');
  if (body.name !== undefined && (!name || name.length > 120)) throw fail('name must be between 1 and 120 characters');
  if (body.parent_id !== undefined && parentId !== null && (!Number.isInteger(parentId) || parentId < 1)) {
    throw fail('parent_id must be a positive integer');
  }
  const result = {};
  if (body.kind !== undefined) result.kind = kind;
  if (body.name !== undefined) result.name = name;
  if (body.parent_id !== undefined || !partial) result.parent_id = parentId;
  if (result.kind || !partial) {
    const nodeKind = result.kind || kind;
    const parentKind = catalogNodeKinds[catalogNodeKinds.indexOf(nodeKind) - 1];
    if (!parentKind && result.parent_id !== null) throw fail('Categories cannot have a parent');
    if (parentKind && result.parent_id === null) throw fail(`${nodeKind} must have a ${parentKind} parent`);
    if (result.parent_id !== null && result.parent_id !== undefined) {
      const parent = db.prepare('SELECT id, kind FROM catalog_nodes WHERE id = ?').get(result.parent_id);
      if (!parent || parent.kind !== parentKind) throw fail(`${nodeKind} must be nested under a ${parentKind}`);
    }
  }
  return result;
};
app.get('/api/admin/catalog', requireAdmin, (req, res) => {
  const nodes = db.prepare(`
    SELECT n.id, n.kind, n.parent_id, n.name,
      (SELECT COUNT(*) FROM catalog_nodes child WHERE child.parent_id = n.id) AS child_count
    FROM catalog_nodes n
    ORDER BY CASE n.kind
      WHEN 'category' THEN 0 WHEN 'subcategory' THEN 1 WHEN 'brand' THEN 2
      WHEN 'product_type' THEN 3 ELSE 4 END, n.name COLLATE NOCASE, n.id
  `).all();
  res.json({ nodes });
});
app.post('/api/admin/catalog-nodes', requireAdmin, (req, res, next) => {
  try {
    const node = readCatalogNodeBody(req.body || {});
    const result = db.prepare('INSERT INTO catalog_nodes (kind, parent_id, name) VALUES (?, ?, ?)')
      .run(node.kind, node.parent_id, node.name);
    res.status(201).json({ node: db.prepare('SELECT id, kind, parent_id, name FROM catalog_nodes WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('A sibling with this name already exists', 409) : error);
  }
});
app.put('/api/admin/catalog-nodes/:id', requireAdmin, (req, res, next) => {
  try {
    const current = db.prepare('SELECT id, kind, parent_id, name FROM catalog_nodes WHERE id = ?').get(req.params.id);
    if (!current) throw fail('Catalog item not found', 404);
    const updates = readCatalogNodeBody(req.body || {}, true);
    const nextNode = { ...current, ...updates };
    if (nextNode.kind !== current.kind) throw fail('Catalog item level cannot be changed');
    if (nextNode.parent_id !== current.parent_id) throw fail('Move catalog items by creating them under the new parent first');
    if (nextNode.parent_id === current.id) throw fail('A catalog item cannot be its own parent');
    const descendants = db.prepare(`
      WITH RECURSIVE descendants(id) AS (
        SELECT id FROM catalog_nodes WHERE parent_id = ?
        UNION ALL SELECT child.id FROM catalog_nodes child JOIN descendants parent ON child.parent_id = parent.id
      ) SELECT id FROM descendants
    `).all(current.id);
    if (descendants.some((node) => node.id === nextNode.parent_id)) throw fail('A catalog item cannot be moved under its descendant');
    const path = catalogNodePath(current);
    const scope = catalogProductScope(path);
    const fieldName = current.kind === 'product_type' ? 'product_type' : current.kind;
    const productUpdate = `UPDATE products SET ${fieldName} = ?, updated_at = CURRENT_TIMESTAMP WHERE ${scope.clause}`;
    const updateNodeAndProducts = db.transaction(() => {
      db.prepare(productUpdate).run(nextNode.name, ...scope.values);
      db.prepare('UPDATE catalog_nodes SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(nextNode.name, current.id);
    });
    updateNodeAndProducts();
    res.json({ node: db.prepare('SELECT id, kind, parent_id, name FROM catalog_nodes WHERE id = ?').get(current.id) });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('A sibling with this name already exists', 409) : error);
  }
});
app.delete('/api/admin/catalog-nodes/:id', requireAdmin, (req, res, next) => {
  try {
    const node = db.prepare('SELECT id, kind, parent_id, name FROM catalog_nodes WHERE id = ?').get(req.params.id);
    if (!node) throw fail('Catalog item not found', 404);
    const scope = catalogProductScope(catalogNodePath(node));
    if (scope.clause && db.prepare(`SELECT 1 FROM products WHERE ${scope.clause} LIMIT 1`).get(...scope.values)) {
      throw fail('This catalog item is used by products. Reassign or delete those products first');
    }
    db.prepare('DELETE FROM catalog_nodes WHERE id = ?').run(node.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
const importAliases = {
  product_name: 'name', title: 'name', name: 'name',
  sku: 'sku', barcode: 'sku', gtin: 'sku',
  price: 'price', selling_price: 'price', sale_price: 'price',
  original_price: 'original_price', mrp: 'original_price',
  stock: 'stock', quantity: 'stock', inventory: 'stock',
  category: 'category', main_category: 'category',
  subcategory: 'subcategory', sub_category: 'subcategory',
  brand: 'brand', product_type: 'product_type', producttype: 'product_type',
  model: 'model', model_number: 'model',
  image_url: 'image_url', image: 'image_url',
  images: 'images_json', images_json: 'images_json',
  specifications: 'specifications_json', specifications_json: 'specifications_json',
  variants: 'variants_json', variants_json: 'variants_json',
  size: 'size', sizes: 'size', color: 'color', colors: 'color',
  storage: 'storage', storage_options: 'storage',
  description: 'description', delivery_information: 'delivery_information',
  active: 'active', rating: 'rating', reviews: 'reviews',
  external_product_id: 'external_product_id', external_id: 'external_product_id'
};
const normalizeImportHeader = (value) => String(value || '').trim().toLowerCase()
  .replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
const parseImportRows = async (buffer, contentType) => {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw fail('Choose a non-empty CSV or Excel file');
  if (buffer.length > 10 * 1024 * 1024) throw fail('Import files must be 10 MB or smaller');
  const isWorkbook = contentType.includes('spreadsheetml')
    || (buffer[0] === 0x50 && buffer[1] === 0x4b);
  let rows;
  try {
    if (isWorkbook) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw fail('The workbook does not contain a worksheet');
      if (worksheet.rowCount > 5001) throw fail('Import up to 5,000 product rows at a time');
      const headers = worksheet.getRow(1).values.slice(1).map((value) => String(value ?? '').trim());
      rows = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const values = row.values.slice(1);
        const record = {};
        headers.forEach((header, index) => {
          const cell = row.getCell(index + 1);
          if (cell.type === ExcelJS.ValueType.Formula) {
            throw fail(`Row ${rowNumber}: formula cells are not supported; paste the calculated value`);
          }
          const value = cell.value;
          record[header] = value && typeof value === 'object'
            ? value.text ?? value.hyperlink ?? value.result ?? ''
            : value ?? '';
        });
        if (values.some((value) => value !== null && value !== undefined && value !== '')) rows.push({ rowNumber, record });
      });
    } else {
      rows = parseCsv(buffer.toString('utf8'), {
        bom: true,
        columns: true,
        skip_empty_lines: true,
        trim: true,
        max_record_size: 100_000
      }).map((record, index) => ({ rowNumber: index + 2, record }));
    }
  } catch (error) {
    if (error.status) throw error;
    throw fail('The file could not be read. Upload a valid CSV or Excel workbook');
  }
  if (!rows.length) throw fail('The first worksheet does not contain product rows');
  if (rows.length > 5000) throw fail('Import up to 5,000 product rows at a time');
  return rows.map(({ record, rowNumber }) => {
    const product = {};
    Object.entries(record).forEach(([header, value]) => {
      const key = importAliases[normalizeImportHeader(header)];
      if (key && value !== '') product[key] = typeof value === 'string' ? value.trim() : value;
    });
    ['size', 'color', 'storage'].forEach((key) => {
      if (product[key] !== undefined) {
        product[key] = String(product[key]).split('|').map((value) => value.trim()).filter(Boolean);
      }
    });
    if (product.variants_json !== undefined && typeof product.variants_json === 'string') {
      try { product.variants_json = JSON.parse(product.variants_json); }
      catch { throw fail(`Row ${rowIndex + 2}: variants must be valid JSON`); }
    }
    if (product.images_json !== undefined && typeof product.images_json === 'string') {
      const images = product.images_json.split(/[|\n;]/).map((value) => value.trim()).filter(Boolean);
      product.images_json = images;
    }
    if (product.specifications_json !== undefined && typeof product.specifications_json === 'string') {
      try { product.specifications_json = JSON.parse(product.specifications_json); }
      catch { throw fail(`Row ${rowNumber}: specifications must be valid JSON`); }
    }
    const variants = product.variants_json || {};
    ['size', 'color', 'storage'].forEach((key) => {
      if (product[key] !== undefined) variants[key] = product[key];
    });
    if (Object.keys(variants).length) product.variants_json = variants;
    delete product.size;
    delete product.color;
    delete product.storage;
    product.__row = rowNumber;
    return product;
  });
};
const findImportedProduct = (product, options) => {
  const { ownerId, feedId } = options;
  const prepare = options.prepare || ((sql) => db.prepare(sql));
  if (feedId && product.external_product_id) {
    const sourcedProduct = prepare(`
      SELECT id FROM products WHERE source_feed_id = ? AND external_product_id = ?
    `).get(feedId, product.external_product_id);
    if (sourcedProduct) return sourcedProduct;
  }
  if (feedId) {
    if (!product.sku) return null;
    const normalizedSku = "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', ''))";
    const conflictingSku = prepare(`
      SELECT id FROM products
      WHERE ${normalizedSku} = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(?), '-', ''), ' ', ''), '_', ''), '.', ''))
        AND (source_feed_id IS NULL OR source_feed_id != ?)
      ORDER BY id LIMIT 1
    `).get(product.sku, feedId);
    if (conflictingSku) {
      throw fail(`SKU ${product.sku} is already assigned outside this supplier feed; ask an admin to review it`, 409);
    }
    const existingSku = prepare(`
      SELECT external_product_id FROM products
      WHERE ${normalizedSku} = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(?), '-', ''), ' ', ''), '_', ''), '.', ''))
        AND seller_user_id IS NULL AND source_feed_id = ?
      ORDER BY id LIMIT 1
    `).get(product.sku, feedId);
    if (existingSku && existingSku.external_product_id !== product.external_product_id) {
      throw fail(`SKU ${product.sku} is linked to a different supplier product ID`, 409);
    }
    return null;
  }
  const ownerClause = ownerId === null ? '' : ownerId === undefined ? '' : ' AND seller_user_id = ?';
  const ownerValues = ownerId === undefined ? [] : ownerId === null ? [] : [ownerId];
  if (product.sku) {
    const bySku = prepare(`SELECT id, source_feed_id, external_product_id FROM products
      WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', ''))
        = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(?), '-', ''), ' ', ''), '_', ''), '.', ''))
        ${ownerClause} ORDER BY id LIMIT 1`)
      .get(product.sku, ...ownerValues);
    if (bySku) return bySku;
  }
  const identityField = product.model ? 'model' : 'name';
  const identityValue = product.model || product.name;
  const identityMatch = prepare(`
    SELECT id FROM products
    WHERE LOWER(TRIM(category)) = LOWER(TRIM(?)) AND LOWER(TRIM(brand)) = LOWER(TRIM(?))
    AND LOWER(TRIM(${identityField})) = LOWER(TRIM(?))
    AND COALESCE(subcategory, '') = COALESCE(?, '') COLLATE NOCASE${ownerClause}
    ORDER BY id LIMIT 1
  `).get(product.category, product.brand, identityValue, product.subcategory || '', ...ownerValues) || null;
  return identityMatch;
};
const importProductRows = (rows, options = {}) => {
  let created = 0;
  let updated = 0;
  const statements = new Map();
  const prepare = (sql) => {
    if (!statements.has(sql)) statements.set(sql, db.prepare(sql));
    return statements.get(sql);
  };
  const seenExternalIds = new Set();
  const seenSkus = new Set();
  rows.forEach((row) => {
    const externalId = String(row.external_product_id || '').trim();
    if (options.feedId && seenExternalIds.has(externalId)) {
      throw fail(`Row ${row.__row}: duplicate external_product_id in this feed batch`);
    }
    if (externalId) seenExternalIds.add(externalId);
    const sku = String(row.sku || '').trim().toLowerCase().replace(/[- _.]/g, '');
    if (sku && seenSkus.has(sku)) throw fail(`Row ${row.__row}: duplicate SKU in this import batch`);
    if (sku) seenSkus.add(sku);
  });
  const runImport = db.transaction(() => {
    rows.forEach((row) => {
      const { __row: rowNumber, external_product_id: externalProductId, ...input } = row;
      if (!input.name || !input.category || !input.brand || input.price === undefined || input.price === '') {
        throw fail(`Row ${rowNumber}: product name, category, brand and price are required`);
      }
      if (options.feedId && (!externalProductId || String(externalProductId).length > 240)) {
        throw fail(`Row ${rowNumber}: supplier products require an external_product_id of up to 240 characters`);
      }
      const suppliedVariants = input.variants_json || {};
      const parsed = {
        ...input,
        variants_json: Object.keys(suppliedVariants).length ? suppliedVariants : undefined,
        active: input.active === undefined ? true : input.active
      };
      let product;
      try {
        product = readProductBody(parsed, true);
      } catch (error) {
        throw fail(`Row ${rowNumber}: ${error.message}`);
      }
      if (!product.name || !product.category || !product.brand || product.price === undefined) {
        throw fail(`Row ${rowNumber}: product name, category, brand and price are required`);
      }
      if (options.feedName) product.seller = options.feedName;
      const existing = findImportedProduct(
        { ...product, sku: product.sku, external_product_id: externalProductId },
        { ...options, prepare }
      );
      if (existing) {
        const fields = Object.keys(product);
        const metadata = options.feedId
          ? ', source_feed_id = ?, external_product_id = ?'
          : '';
        const parameters = [...fields.map((field) => product[field])];
        if (options.feedId) parameters.push(options.feedId, String(externalProductId));
        parameters.push(existing.id);
        prepare(`UPDATE products SET ${fields.map((field) => `${field} = ?`).join(', ')}${metadata}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .run(...parameters);
        syncProductCatalogNodes(product);
        updated += 1;
      } else {
        const saved = { ...product };
        if (options.ownerId !== undefined) saved.seller_user_id = options.ownerId;
        if (options.feedId) {
          saved.source_feed_id = options.feedId;
          saved.external_product_id = String(externalProductId);
        }
        const fields = Object.keys(saved);
        const inserted = prepare(`INSERT INTO products (${fields.join(', ')}, updated_at) VALUES (${fields.map(() => '?').join(', ')}, CURRENT_TIMESTAMP)`)
          .run(...fields.map((field) => saved[field]));
        syncProductCatalogNodes({ ...product, category: product.category });
        if (!inserted.lastInsertRowid) throw fail(`Row ${rowNumber}: product could not be saved`);
        created += 1;
      }
    });
    if (options.feedId) {
      prepare(`
        UPDATE supplier_integrations
        SET last_sync_at = CURRENT_TIMESTAMP, last_sync_status = 'success', last_sync_error = NULL,
          last_sync_count = ?, last_sync_created = ?, last_sync_updated = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(rows.length, created, updated, options.feedId);
    }
  });
  runImport();
  return { created, updated, total: rows.length };
};
const importFileParser = express.raw({
  type: () => true,
  limit: '10mb'
});
const handleProductFileImport = (options, req, res, next) => {
  importFileParser(req, res, (parseError) => {
    if (parseError) return next(parseError);
    parseImportRows(req.body, req.get('content-type') || '')
      .then((rows) => res.json({ results: importProductRows(rows, options) }))
      .catch(next);
  });
};
app.post('/api/admin/products/import', requireAdmin, (req, res, next) => {
  handleProductFileImport({}, req, res, next);
});
app.get('/api/admin/supplier-feeds', requireAdmin, (req, res) => {
  const feeds = db.prepare(`
    SELECT id, name, active, last_sync_at, last_sync_status, last_sync_error,
      last_sync_count, last_sync_created, last_sync_updated, created_at
    FROM supplier_integrations ORDER BY id DESC
  `).all();
  res.json({ feeds });
});
app.post('/api/admin/supplier-feeds', requireAdmin, (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    if (name.length < 2 || name.length > 120) throw fail('Supplier name must be between 2 and 120 characters');
    const token = crypto.randomBytes(32).toString('base64url');
    const result = db.prepare('INSERT INTO supplier_integrations (name, token_hash) VALUES (?, ?)')
      .run(name, tokenHash(token));
    res.status(201).json({
      feed: db.prepare(`SELECT id, name, active, last_sync_at, last_sync_status, last_sync_count,
        last_sync_created, last_sync_updated, created_at FROM supplier_integrations WHERE id = ?`).get(result.lastInsertRowid),
      api_key: token
    });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('A supplier with this name or key already exists', 409) : error);
  }
});
app.post('/api/admin/supplier-feeds/:id/rotate-key', requireAdmin, (req, res, next) => {
  try {
    const id = integer(req.params.id, 'id');
    const token = crypto.randomBytes(32).toString('base64url');
    const result = db.prepare(`
      UPDATE supplier_integrations SET token_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(tokenHash(token), id);
    if (!result.changes) throw fail('Supplier integration not found', 404);
    res.json({
      feed: db.prepare('SELECT id, name, active, last_sync_at, last_sync_status FROM supplier_integrations WHERE id = ?').get(id),
      api_key: token
    });
  } catch (error) {
    next(error);
  }
});
app.patch('/api/admin/supplier-feeds/:id', requireAdmin, (req, res, next) => {
  try {
    const id = integer(req.params.id, 'id');
    if (req.body?.active !== true && req.body?.active !== false) throw fail('active must be a boolean');
    const result = db.prepare('UPDATE supplier_integrations SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.body.active ? 1 : 0, id);
    if (!result.changes) throw fail('Supplier integration not found', 404);
    res.json({ feed: db.prepare('SELECT id, name, active, last_sync_at, last_sync_status, created_at FROM supplier_integrations WHERE id = ?').get(id) });
  } catch (error) { next(error); }
});
app.delete('/api/admin/supplier-feeds/:id', requireAdmin, (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM supplier_integrations WHERE id = ?').run(integer(req.params.id, 'id'));
    if (!result.changes) throw fail('Supplier integration not found', 404);
    res.status(204).end();
  } catch (error) { next(error); }
});
app.post('/api/supplier/feed', supplierFeedRateLimit, (req, res, next) => {
  let feed = null;
  try {
    const token = req.get('x-supplier-key') || '';
    feed = db.prepare('SELECT id, name FROM supplier_integrations WHERE token_hash = ? AND active = 1')
      .get(tokenHash(token));
    if (!feed) throw fail('Valid supplier feed credentials are required', 401);
    if (process.env.NODE_ENV === 'production' && !req.secure) {
      throw fail('Supplier feeds require HTTPS in production', 400);
    }
    if (!Array.isArray(req.body?.products) || !req.body.products.length || req.body.products.length > 5000) {
      throw fail('products must contain between 1 and 5,000 catalog records');
    }
    const rows = req.body.products.map((row, index) => ({ ...(row || {}), __row: index + 1 }));
    const results = importProductRows(rows, { feedId: feed.id, feedName: feed.name });
    res.json({ supplier: feed.name, results });
  } catch (error) {
    if (feed) {
      db.prepare(`
        UPDATE supplier_integrations
        SET last_sync_at = CURRENT_TIMESTAMP, last_sync_status = 'failed',
          last_sync_error = ?, last_sync_count = 0, last_sync_created = 0,
          last_sync_updated = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(String(error.message || 'Feed import failed').slice(0, 500), feed.id);
    }
    next(error);
  }
});
app.get('/api/admin/products', requireAdmin, (req, res) => {
  const rows = db.prepare(`SELECT ${productFields} FROM products ORDER BY name ASC, id`).all();
  res.json({ products: rows });
});
app.get('/api/admin/products/duplicates', requireAdmin, (req, res, next) => {
  try {
    const requestedLimit = req.query.limit === undefined ? 50 : Number(req.query.limit);
    if (!Number.isInteger(requestedLimit) || requestedLimit < 1 || requestedLimit > 100) {
      throw fail('limit must be an integer between 1 and 100');
    }
    const groups = db.prepare(`
      SELECT 'sku' AS match_type,
        LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', '')) AS match_key,
        MIN(TRIM(sku)) AS match_value,
        COUNT(*) AS product_count
      FROM products
      WHERE sku IS NOT NULL AND TRIM(sku) != ''
      GROUP BY LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', ''))
      HAVING COUNT(*) > 1
      UNION ALL
      SELECT 'catalog_identity' AS match_type,
        LOWER(TRIM(category)) || char(31) || LOWER(TRIM(brand)) || char(31) ||
          LOWER(TRIM(CASE WHEN model IS NULL OR TRIM(model) = '' THEN name ELSE model END)) AS match_key,
        MIN(TRIM(category) || ' / ' || TRIM(brand) || ' / ' ||
          TRIM(CASE WHEN model IS NULL OR TRIM(model) = '' THEN name ELSE model END)) AS match_value,
        COUNT(*) AS product_count
      FROM products
      WHERE (sku IS NULL OR TRIM(sku) = '') AND TRIM(category) != '' AND TRIM(brand) != ''
      GROUP BY LOWER(TRIM(category)), LOWER(TRIM(brand)),
        LOWER(TRIM(CASE WHEN model IS NULL OR TRIM(model) = '' THEN name ELSE model END))
      HAVING COUNT(*) > 1
      ORDER BY product_count DESC, match_type, match_value COLLATE NOCASE
      LIMIT ?
    `).all(requestedLimit);
    const findSkuMembers = db.prepare(`
      SELECT id, name, sku, category, brand, model, seller, source_feed_id, external_product_id, active
      FROM products
      WHERE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(sku), '-', ''), ' ', ''), '_', ''), '.', '')) = ?
      ORDER BY id LIMIT 10
    `);
    const findIdentityMembers = db.prepare(`
      SELECT id, name, sku, category, brand, model, seller, source_feed_id, external_product_id, active
      FROM products
      WHERE (sku IS NULL OR TRIM(sku) = '')
        AND LOWER(TRIM(category)) = ? AND LOWER(TRIM(brand)) = ?
        AND LOWER(TRIM(CASE WHEN model IS NULL OR TRIM(model) = '' THEN name ELSE model END)) = ?
      ORDER BY id LIMIT 10
    `);
    const duplicates = groups.map((group) => {
      const members = group.match_type === 'sku'
        ? findSkuMembers.all(group.match_key)
        : findIdentityMembers.all(...group.match_key.split(String.fromCharCode(31)));
      return {
        match_type: group.match_type,
        match_value: group.match_value,
        product_count: group.product_count,
        truncated: group.product_count > members.length,
        products: members
      };
    });
    res.json({ duplicates, limit: requestedLimit });
  } catch (error) {
    next(error);
  }
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
    const result = db.transaction(() => {
      const inserted = db.prepare(`INSERT INTO products (${fields.join(',')}, updated_at) VALUES (${placeholders}, CURRENT_TIMESTAMP)`).run(...fields.map((field) => p[field]));
      syncProductCatalogNodes(p);
      return inserted;
    })();
    res.status(201).json({ product: db.prepare(`SELECT ${productFields} FROM products WHERE id=?`).get(result.lastInsertRowid) });
  } catch (error) { next(error); }
});
app.put('/api/admin/products/:id', requireAdmin, (req, res, next) => {
  try {
    const p = readProductBody(req.body || {}, true); const fields = Object.keys(p);
    if (!fields.length) throw fail('No product fields supplied');
    const result = db.transaction(() => {
      const updated = db.prepare(`UPDATE products SET ${fields.map((field) => `${field}=?`).join(',')}, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(...fields.map((field) => p[field]), req.params.id);
      if (updated.changes) {
        const product = db.prepare('SELECT name, category, subcategory, brand, product_type, model FROM products WHERE id = ?').get(req.params.id);
        syncProductCatalogNodes(product);
      }
      return updated;
    })();
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

app.post('/api/auth/signup', authRateLimit, (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!validName(name) || !validEmail(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) {
      throw fail('name, email and a password of at least 8 characters are required');
    }
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
      String(name).trim(), String(email).trim().toLowerCase(), hashPassword(password)
    );
    const user = db.prepare('SELECT id, name, email, mobile, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ user: publicUser(user), token: issueToken(user.id) });
  } catch (error) { next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('Email is already registered', 409) : error); }
});

app.post('/api/auth/login', authRateLimit, (req, res, next) => {
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

app.patch('/api/auth/profile', requireAuth, (req, res, next) => {
  try {
    const { name, email, mobile, current_password: currentPassword } = req.body || {};
    if (!validName(name)) throw fail('Enter a valid name');
    if (!validEmail(email)) throw fail('Enter a valid email address');
    if (mobile !== '' && (typeof mobile !== 'string' || !/^[6-9]\d{9}$/.test(mobile))) {
      throw fail('Enter a valid 10-digit Indian mobile number, or leave it blank');
    }
    if (typeof currentPassword !== 'string' || !currentPassword || currentPassword.length > 128) {
      throw fail('Enter your current password to confirm these changes');
    }
    const account = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!account || !verifyPassword(currentPassword, account.password_hash)) {
      throw fail('Current password is incorrect', 401);
    }
    db.prepare('UPDATE users SET name = ?, email = ?, mobile = ? WHERE id = ?').run(
      name.trim(), email.trim().toLowerCase(), mobile || null, req.user.id
    );
    const user = db.prepare('SELECT id, name, email, mobile, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('Email is already registered to another account', 409) : error);
  }
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  const header = req.get('authorization') || '';
  const token = header.slice(7).trim();
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
  res.status(204).end();
});

const readSellerAccount = (userId) => db.prepare(`
  SELECT id, business_name, category, contact_phone, gst_number, status, created_at, updated_at
  FROM seller_accounts WHERE user_id = ?
`).get(userId) || null;
app.get('/api/seller-account', requireAuth, (req, res) => {
  res.json({ seller: readSellerAccount(req.user.id) });
});
app.post('/api/seller-account', requireAuth, (req, res, next) => {
  try {
    const { business_name: businessName, category, contact_phone: contactPhone, gst_number: gstNumber = '' } = req.body || {};
    const normalizedCategory = normalizeCategory(category);
    const normalizedGst = String(gstNumber).trim().toUpperCase();
    if (typeof businessName !== 'string' || businessName.trim().length < 2 || businessName.trim().length > 120) {
      throw fail('Business name must be between 2 and 120 characters');
    }
    if (!productCategories().includes(normalizedCategory) && normalizedCategory !== 'Other') {
      throw fail(`category must be one of: ${[...productCategories(), 'Other'].join(', ')}`);
    }
    if (typeof contactPhone !== 'string' || !/^[6-9]\d{9}$/.test(contactPhone)) {
      throw fail('Enter a valid 10-digit Indian mobile number');
    }
    if (normalizedGst && !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/.test(normalizedGst)) {
      throw fail('Enter a valid GSTIN or leave it blank');
    }
    const existingSeller = readSellerAccount(req.user.id);
    db.prepare(`
      INSERT INTO seller_accounts (user_id, business_name, category, contact_phone, gst_number)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET business_name=excluded.business_name,
        category=excluded.category, contact_phone=excluded.contact_phone,
        gst_number=excluded.gst_number,
        status=CASE WHEN seller_accounts.status='approved' THEN 'approved' ELSE 'pending' END,
        updated_at=CURRENT_TIMESTAMP
    `).run(req.user.id, businessName.trim(), normalizedCategory, contactPhone, normalizedGst || null);
    res.status(existingSeller ? 200 : 201).json({ seller: readSellerAccount(req.user.id) });
  } catch (error) { next(error); }
});
const sellerOrderStatuses = { pending: 'processing', processing: 'shipped', shipped: 'delivered' };
app.get('/api/seller/orders', requireAuth, requireApprovedSeller, (req, res) => {
  const rows = db.prepare(`
    SELECT o.id AS order_id, o.status AS order_status, o.total, o.created_at,
      o.payment_status,
      oi.id AS order_item_id, oi.product_name, oi.unit_price, oi.quantity,
      oi.fulfillment_status, oi.shipped_at, oi.delivered_at,
      oi.tracking_provider, oi.tracking_number, oi.tracking_url, oi.tracking_updated_at
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE oi.seller_user_id = ?
      AND (o.payment_method != 'razorpay' OR o.payment_status = 'captured')
    ORDER BY o.id DESC, oi.id
  `).all(req.user.id);
  const ordersById = new Map();
  rows.forEach((row) => {
    if (!ordersById.has(row.order_id)) {
      ordersById.set(row.order_id, {
        id: row.order_id,
        status: row.order_status,
        total: row.total,
        created_at: row.created_at,
        payment_status: row.payment_status,
        items: []
      });
    }
    ordersById.get(row.order_id).items.push({
      id: row.order_item_id,
      name: row.product_name,
      unit_price: row.unit_price,
      quantity: row.quantity,
      fulfillment_status: row.fulfillment_status,
      shipped_at: row.shipped_at,
      delivered_at: row.delivered_at,
      tracking_provider: row.tracking_provider,
      tracking_number: row.tracking_number,
      tracking_url: row.tracking_url,
      tracking_updated_at: row.tracking_updated_at
    });
  });
  res.json({ orders: [...ordersById.values()] });
});
app.patch('/api/seller/order-items/:id/status', requireAuth, requireApprovedSeller, (req, res, next) => {
  try {
    const itemId = integer(req.params.id, 'id');
    const { status, tracking_provider: trackingProvider, tracking_number: trackingNumber, tracking_url: trackingUrl } = req.body || {};
    const item = db.prepare(`
      SELECT oi.id, oi.order_id, oi.fulfillment_status, oi.tracking_provider, oi.tracking_number,
        oi.tracking_url, o.payment_method, o.payment_status
      FROM order_items oi JOIN orders o ON o.id = oi.order_id
      WHERE oi.id = ? AND oi.seller_user_id = ?
    `).get(itemId, req.user.id);
    if (!item) throw fail('Order item not found', 404);
    if (item.payment_method === 'razorpay' && item.payment_status !== 'captured') {
      throw fail('This order cannot be fulfilled until its payment is captured', 409);
    }
    const expectedStatus = sellerOrderStatuses[item.fulfillment_status];
    if (!expectedStatus || status !== expectedStatus) {
      throw fail(`This item can only move from ${item.fulfillment_status} to ${expectedStatus || 'a terminal state'}`, 409);
    }
    let shipment = null;
    if (status === 'shipped') {
      const supplied = [trackingProvider, trackingNumber, trackingUrl].some((value) => value !== undefined);
      if (supplied) {
        if (typeof trackingProvider !== 'string' || !/^[\p{L}\p{N} .&_-]{2,60}$/u.test(trackingProvider.trim())
          || typeof trackingNumber !== 'string' || trackingNumber.trim().length < 3 || trackingNumber.trim().length > 100) {
          throw fail('Enter a valid carrier name and tracking number');
        }
        let parsedTrackingUrl;
        try {
          parsedTrackingUrl = new URL(trackingUrl);
        } catch {
          throw fail('Enter a valid HTTPS tracking URL');
        }
        if (parsedTrackingUrl.protocol !== 'https:' || parsedTrackingUrl.username || parsedTrackingUrl.password) {
          throw fail('Tracking links must use HTTPS and cannot contain credentials');
        }
        shipment = {
          provider: trackingProvider.trim(),
          number: trackingNumber.trim(),
          url: parsedTrackingUrl.toString()
        };
      } else if (item.tracking_provider && item.tracking_number && item.tracking_url) {
        shipment = {
          provider: item.tracking_provider,
          number: item.tracking_number,
          url: item.tracking_url
        };
      } else if (shippingTrackingRequired && item.payment_method !== 'demo') {
        throw fail('Add the carrier name, tracking number, and HTTPS tracking link before marking this paid order as shipped', 409);
      }
    } else if ([trackingProvider, trackingNumber, trackingUrl].some((value) => value !== undefined)) {
      throw fail('Shipment tracking details can only be saved when marking the item shipped');
    }
    const updateStatus = db.transaction(() => {
      const updated = db.prepare(`
        UPDATE order_items SET fulfillment_status = ?,
          shipped_at = CASE WHEN ? = 'shipped' THEN CURRENT_TIMESTAMP ELSE shipped_at END,
          delivered_at = CASE WHEN ? = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END,
          tracking_provider = COALESCE(?, tracking_provider),
          tracking_number = COALESCE(?, tracking_number),
          tracking_url = COALESCE(?, tracking_url),
          tracking_updated_at = CASE WHEN ? = 'shipped' THEN CURRENT_TIMESTAMP ELSE tracking_updated_at END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND fulfillment_status = ?
      `).run(
        status, status, status, shipment?.provider || null, shipment?.number || null,
        shipment?.url || null, status, itemId, item.fulfillment_status
      );
      if (!updated.changes) {
        throw fail('Order item status changed. Refresh and try again.', 409);
      }
      refreshOrderStatus(item.order_id);
    });
    updateStatus();
    res.json({ order: orderRowsForSellerItem(itemId, req.user.id) });
  } catch (error) { next(error); }
});
const orderRowsForSellerItem = (itemId, userId) => db.prepare(`
  SELECT o.id AS order_id, o.status AS order_status, o.total, o.payment_method, o.payment_status,
    oi.id AS order_item_id,
    oi.product_name, oi.quantity, oi.fulfillment_status,
    oi.tracking_provider, oi.tracking_number, oi.tracking_url, oi.tracking_updated_at
  FROM order_items oi JOIN orders o ON o.id = oi.order_id
  WHERE oi.id = ? AND oi.seller_user_id = ?
`).get(itemId, userId);
app.get('/api/seller/returns', requireAuth, requireApprovedSeller, (req, res) => {
  const requests = db.prepare(`
    SELECT r.id, r.order_id, r.order_item_id, r.reason, r.status, r.refund_status,
      r.refund_review_required, r.created_at, oi.product_name, oi.quantity
    FROM order_returns r
    JOIN order_items oi ON oi.id = r.order_item_id
    WHERE oi.seller_user_id = ?
    ORDER BY r.id DESC
  `).all(req.user.id);
  res.json({ requests });
});
app.patch('/api/seller/returns/:id', requireAuth, requireApprovedSeller, (req, res, next) => {
  try {
    const returnId = integer(req.params.id, 'id');
    const { status } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) throw fail('Return status must be approved or rejected');
    const result = db.prepare(`
      UPDATE order_returns SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pending'
        AND order_item_id IN (SELECT id FROM order_items WHERE seller_user_id = ?)
    `).run(status, returnId, req.user.id);
    if (!result.changes) {
      const ownedRequest = db.prepare(`
        SELECT r.status FROM order_returns r
        JOIN order_items oi ON oi.id = r.order_item_id
        WHERE r.id = ? AND oi.seller_user_id = ?
      `).get(returnId, req.user.id);
      if (!ownedRequest) throw fail('Return request not found', 404);
      throw fail('This return request has already been reviewed', 409);
    }
    const request = db.prepare('SELECT * FROM order_returns WHERE id = ?').get(returnId);
    res.json({ request });
  } catch (error) { next(error); }
});
const sellerUploadPath = (userId) => path.join(sellerUploadRoot, String(userId));
const sellerUploadUrlPattern = (userId) => new RegExp(`^/assets/uploads/sellers/${userId}/[a-f0-9]{32}\\.(?:png|jpg|webp)$`, 'i');
const sellerImageReferences = (product, imageUrl) => product.image_url === imageUrl
  || String(product.images_json || '').includes(imageUrl);
app.post('/api/seller/products/images', requireAuth, requireApprovedSeller, (req, res, next) => {
  const parseImage = express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '5mb' });
  parseImage(req, res, async (error) => {
    if (error) return next(error);
    try {
      const image = req.body;
      if (!Buffer.isBuffer(image) || !image.length) throw fail('Choose a JPEG, PNG or WebP image');
      const contentType = req.get('content-type')?.split(';')[0].trim().toLowerCase();
      const imageTypes = {
        'image/jpeg': { extension: 'jpg', matches: (data) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff },
        'image/png': { extension: 'png', matches: (data) => data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
        'image/webp': { extension: 'webp', matches: (data) => data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP' }
      };
      const imageType = imageTypes[contentType];
      if (!imageType || !imageType.matches(image)) throw fail('The image content does not match a supported JPEG, PNG or WebP file');
      const directory = sellerUploadPath(req.user.id);
      await fs.mkdir(directory, { recursive: true });
      const fileName = `${crypto.randomBytes(16).toString('hex')}.${imageType.extension}`;
      await fs.writeFile(path.join(directory, fileName), image, { flag: 'wx' });
      res.status(201).json({ url: `/assets/uploads/sellers/${req.user.id}/${fileName}` });
    } catch (uploadError) {
      next(uploadError);
    }
  });
});
app.delete('/api/seller/products/images', requireAuth, requireApprovedSeller, async (req, res, next) => {
  try {
    const { url } = req.body || {};
    if (typeof url !== 'string' || !sellerUploadUrlPattern(req.user.id).test(url)) {
      throw fail('Only your own uploaded product photos can be removed');
    }
    const products = db.prepare('SELECT image_url, images_json FROM products WHERE seller_user_id = ?').all(req.user.id);
    if (products.some((product) => sellerImageReferences(product, url))) {
      throw fail('This photo is currently used by a product');
    }
    const filePath = path.join(sellerUploadPath(req.user.id), path.basename(url));
    await fs.unlink(filePath);
    res.status(204).end();
  } catch (error) {
    next(error.code === 'ENOENT' ? fail('Uploaded photo was not found', 404) : error);
  }
});
const sellerProductFields = `${productFields}, seller_user_id`;
const readSellerProductBody = (body, seller, partial = false) => {
  const allowedFields = ['name', 'image_url', 'images_json', 'price', 'stock', 'category', 'subcategory', 'brand', 'product_type', 'model', 'variants_json', 'specifications_json', 'delivery_information', 'description'];
  const sellerFields = Object.fromEntries(allowedFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));
  return readProductBody({ ...sellerFields, active: true, seller: seller.business_name }, partial);
};
const validateSellerProductImages = (product, userId) => {
  const images = JSON.parse(product.images_json || '[]');
  const productImages = [...images, product.image_url].filter((url) => typeof url === 'string' && url.startsWith('/assets/uploads/sellers/'));
  if (productImages.some((url) => !sellerUploadUrlPattern(userId).test(url))) {
    throw fail('You can only use photos uploaded to your own seller account');
  }
};
app.get('/api/seller/products', requireAuth, requireApprovedSeller, (req, res) => {
  const products = db.prepare(`SELECT ${sellerProductFields} FROM products WHERE seller_user_id = ? ORDER BY updated_at DESC, id DESC`).all(req.user.id);
  res.json({ products });
});
app.post('/api/seller/products/import', requireAuth, requireApprovedSeller, (req, res, next) => {
  handleProductFileImport({ ownerId: req.user.id }, req, res, next);
});
app.post('/api/seller/products', requireAuth, requireApprovedSeller, (req, res, next) => {
  try {
    const body = req.body || {};
    const product = readSellerProductBody(body, req.seller);
    if (!Number.isFinite(Number(body.discount_percent)) || Number(body.discount_percent) < 0 || Number(body.discount_percent) > 95) {
      throw fail('discount_percent must be between 0 and 95');
    }
    product.original_price = Number(body.discount_percent) === 0
      ? null
      : Math.round(product.price / (1 - Number(body.discount_percent) / 100));
    validateSellerProductImages(product, req.user.id);
    const fields = [...Object.keys(product), 'seller_user_id'];
    const result = db.transaction(() => {
      const inserted = db.prepare(`INSERT INTO products (${fields.join(',')}, updated_at) VALUES (${fields.map(() => '?').join(',')}, CURRENT_TIMESTAMP)`)
        .run(...Object.values(product), req.user.id);
      syncProductCatalogNodes(product);
      return inserted;
    })();
    res.status(201).json({ product: db.prepare(`SELECT ${sellerProductFields} FROM products WHERE id = ? AND seller_user_id = ?`).get(result.lastInsertRowid, req.user.id) });
  } catch (error) { next(error); }
});
app.put('/api/seller/products/:id', requireAuth, requireApprovedSeller, (req, res, next) => {
  try {
    const id = integer(req.params.id, 'id');
    const current = db.prepare(`SELECT ${sellerProductFields} FROM products WHERE id = ? AND seller_user_id = ?`).get(id, req.user.id);
    if (!current) throw fail('Product not found', 404);
    const body = req.body || {};
    const product = readSellerProductBody(body, req.seller, true);
    if (body.discount_percent !== undefined) {
      if (!Number.isFinite(Number(body.discount_percent)) || Number(body.discount_percent) < 0 || Number(body.discount_percent) > 95) {
        throw fail('discount_percent must be between 0 and 95');
      }
      product.original_price = Number(body.discount_percent) === 0
        ? null
        : Math.round(Number(product.price ?? current.price) / (1 - Number(body.discount_percent) / 100));
    }
    validateSellerProductImages(product.images_json !== undefined ? product : current, req.user.id);
    const fields = Object.keys(product);
    const updated = db.transaction(() => {
      const result = db.prepare(`UPDATE products SET ${fields.map((field) => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND seller_user_id = ?`)
        .run(...fields.map((field) => product[field]), id, req.user.id);
      if (result.changes) {
        const saved = db.prepare('SELECT name, category, subcategory, brand, product_type, model FROM products WHERE id = ?').get(id);
        syncProductCatalogNodes(saved);
      }
      return result;
    })();
    if (!updated.changes) throw fail('Product not found', 404);
    res.json({ product: db.prepare(`SELECT ${sellerProductFields} FROM products WHERE id = ? AND seller_user_id = ?`).get(id, req.user.id) });
  } catch (error) { next(error); }
});
app.delete('/api/seller/products/:id', requireAuth, requireApprovedSeller, async (req, res, next) => {
  try {
    const id = integer(req.params.id, 'id');
    const product = db.prepare('SELECT image_url, images_json FROM products WHERE id = ? AND seller_user_id = ?').get(id, req.user.id);
    if (!product) throw fail('Product not found', 404);
    const images = JSON.parse(product.images_json || '[]');
    if (!Array.isArray(images)) throw fail('Stored product photo data is invalid', 500);
    const result = db.prepare('DELETE FROM products WHERE id = ? AND seller_user_id = ?').run(id, req.user.id);
    if (!result.changes) throw fail('Product not found', 404);
    const remainingProducts = db.prepare('SELECT image_url, images_json FROM products WHERE seller_user_id = ?').all(req.user.id);
    const uploadedImages = [...new Set([...images, product.image_url].filter((url) => typeof url === 'string' && sellerUploadUrlPattern(req.user.id).test(url)))];
    for (const url of uploadedImages) {
      if (remainingProducts.some((entry) => sellerImageReferences(entry, url))) continue;
      try {
        await fs.unlink(path.join(sellerUploadPath(req.user.id), path.basename(url)));
      } catch (error) {
        if (error.code !== 'ENOENT') {
          const cleanupError = new Error(`Product was deleted, but photo cleanup failed: ${error.message}`);
          cleanupError.status = 500;
          throw cleanupError;
        }
      }
    }
    res.status(204).end();
  } catch (error) { next(error); }
});
app.get('/api/notification-preferences', requireAuth, (req, res) => {
  db.prepare('INSERT OR IGNORE INTO notification_preferences (user_id) VALUES (?)').run(req.user.id);
  const preferences = db.prepare(`
    SELECT offers, orders, messages, updated_at FROM notification_preferences WHERE user_id = ?
  `).get(req.user.id);
  res.json({ preferences: { ...preferences, offers: Boolean(preferences.offers), orders: Boolean(preferences.orders), messages: Boolean(preferences.messages) } });
});
app.put('/api/notification-preferences', requireAuth, (req, res, next) => {
  try {
    const { offers, orders, messages } = req.body || {};
    if (![offers, orders, messages].every((value) => typeof value === 'boolean')) {
      throw fail('offers, orders and messages must be boolean values');
    }
    db.prepare(`
      INSERT INTO notification_preferences (user_id, offers, orders, messages)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET offers=excluded.offers, orders=excluded.orders,
        messages=excluded.messages, updated_at=CURRENT_TIMESTAMP
    `).run(req.user.id, Number(offers), Number(orders), Number(messages));
    const preferences = db.prepare(`
      SELECT offers, orders, messages, updated_at FROM notification_preferences WHERE user_id = ?
    `).get(req.user.id);
    res.json({ preferences: { ...preferences, offers: Boolean(preferences.offers), orders: Boolean(preferences.orders), messages: Boolean(preferences.messages) } });
  } catch (error) { next(error); }
});
app.get('/api/notifications', requireAuth, (req, res) => {
  const notifications = db.prepare(`
    SELECT id, type, title, message, read_at, created_at
    FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50
  `).all(req.user.id);
  res.json({ notifications });
});
app.post('/api/notifications/read-all', requireAuth, (req, res) => {
  const result = db.prepare(`
    UPDATE notifications SET read_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND read_at IS NULL
  `).run(req.user.id);
  res.json({ updated: result.changes });
});
const supportCategories = ['Order', 'Refund', 'Delivery', 'Account', 'Other'];
const readSupportTickets = (userId) => db.prepare(`
  SELECT id, category, subject, message, order_id, status, created_at, updated_at
  FROM support_tickets WHERE user_id = ? ORDER BY id DESC
`).all(userId);
app.get('/api/support/tickets', requireAuth, (req, res) => {
  res.json({ tickets: readSupportTickets(req.user.id) });
});
app.post('/api/support/tickets', requireAuth, (req, res, next) => {
  try {
    const { category, subject, message, order_id: orderId = null } = req.body || {};
    if (!supportCategories.includes(category)) throw fail(`category must be one of: ${supportCategories.join(', ')}`);
    if (typeof subject !== 'string' || subject.trim().length < 3 || subject.trim().length > 120) {
      throw fail('Subject must be between 3 and 120 characters');
    }
    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      throw fail('Message must be between 10 and 2000 characters');
    }
    let normalizedOrderId = null;
    if (orderId !== null && orderId !== '') {
      normalizedOrderId = integer(orderId, 'order_id');
      if (!normalizedOrderId || !db.prepare('SELECT id FROM orders WHERE id = ? AND user_id = ?').get(normalizedOrderId, req.user.id)) {
        throw fail('Order not found for this account', 404);
      }
    }
    const result = db.prepare(`
      INSERT INTO support_tickets (user_id, category, subject, message, order_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, category, subject.trim(), message.trim(), normalizedOrderId);
    res.status(201).json({ ticket: readSupportTickets(req.user.id).find((ticket) => ticket.id === result.lastInsertRowid) });
  } catch (error) { next(error); }
});
const readAdvertisingRequests = (userId) => db.prepare(`
  SELECT id, brand_name, campaign_details, monthly_budget, status, created_at, updated_at
  FROM advertising_requests WHERE user_id = ? ORDER BY id DESC
`).all(userId);
app.get('/api/advertising/requests', requireAuth, (req, res) => {
  res.json({ requests: readAdvertisingRequests(req.user.id) });
});
app.post('/api/advertising/requests', requireAuth, (req, res, next) => {
  try {
    const { brand_name: brandName, campaign_details: campaignDetails, monthly_budget: monthlyBudget } = req.body || {};
    if (typeof brandName !== 'string' || brandName.trim().length < 2 || brandName.trim().length > 120) {
      throw fail('Brand name must be between 2 and 120 characters');
    }
    if (typeof campaignDetails !== 'string' || campaignDetails.trim().length < 20 || campaignDetails.trim().length > 2000) {
      throw fail('Campaign details must be between 20 and 2000 characters');
    }
    const normalizedBudget = integer(monthlyBudget, 'monthly_budget');
    if (![5000, 25000, 100000, 250000].includes(normalizedBudget)) {
      throw fail('Choose a supported monthly budget');
    }
    const result = db.prepare(`
      INSERT INTO advertising_requests (user_id, brand_name, campaign_details, monthly_budget)
      VALUES (?, ?, ?, ?)
    `).run(req.user.id, brandName.trim(), campaignDetails.trim(), normalizedBudget);
    res.status(201).json({ request: readAdvertisingRequests(req.user.id).find((item) => item.id === result.lastInsertRowid) });
  } catch (error) { next(error); }
});
app.get('/api/admin/marketplace-requests', requireAdmin, (req, res) => {
  res.json({
    sellers: db.prepare(`SELECT s.id, s.user_id, u.name, u.email, s.business_name, s.category, s.contact_phone, s.gst_number, s.status, s.created_at FROM seller_accounts s JOIN users u ON u.id=s.user_id ORDER BY s.id DESC`).all(),
    supportTickets: db.prepare(`SELECT t.id, t.user_id, u.name, u.email, t.category, t.subject, t.message, t.order_id, t.status, t.created_at FROM support_tickets t JOIN users u ON u.id=t.user_id ORDER BY t.id DESC`).all(),
    advertisingRequests: db.prepare(`SELECT a.id, a.user_id, u.name, u.email, a.brand_name, a.campaign_details, a.monthly_budget, a.status, a.created_at FROM advertising_requests a JOIN users u ON u.id=a.user_id ORDER BY a.id DESC`).all()
  });
});
app.patch('/api/admin/marketplace-requests/:kind/:id', requireAdmin, (req, res, next) => {
  try {
    const requestTypes = new Map([
      ['seller', { table: 'seller_accounts', statuses: ['pending', 'approved', 'rejected'] }],
      ['support', { table: 'support_tickets', statuses: ['open', 'in_progress', 'resolved'] }],
      ['advertising', { table: 'advertising_requests', statuses: ['pending', 'approved', 'rejected'] }]
    ]);
    const requestType = requestTypes.get(req.params.kind);
    if (!requestType) throw fail('Unsupported marketplace request type', 404);
    const id = integer(req.params.id, 'id');
    if (!id) throw fail('id must be a positive integer');
    const { status } = req.body || {};
    if (!requestType.statuses.includes(status)) throw fail(`status must be one of: ${requestType.statuses.join(', ')}`);
    const result = db.prepare(`UPDATE ${requestType.table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, id);
    if (!result.changes) throw fail('Marketplace request not found', 404);
    const record = db.prepare(`SELECT * FROM ${requestType.table} WHERE id = ?`).get(id);
    res.json({ kind: req.params.kind, request: record });
  } catch (error) { next(error); }
});

const plusMembershipCoins = 500;
const readRewards = (userId) => {
  db.prepare('INSERT OR IGNORE INTO rewards_accounts (user_id) VALUES (?)').run(userId);
  const { coins } = db.prepare('SELECT coins FROM rewards_accounts WHERE user_id = ?').get(userId);
  const plusMember = coins >= plusMembershipCoins;
  return {
    coins,
    plusMember,
    plusMembershipCoins,
    coinsToPlus: Math.max(0, plusMembershipCoins - coins),
    coupons: [
      { code: 'SAVE100', title: '₹100 off', description: 'On eligible orders above ₹999', available: true },
      { code: 'BANK10', title: '10% bank discount', description: 'On selected bank cards', available: true },
      { code: 'FREEDEL', title: 'Free delivery', description: 'On eligible orders', available: true },
      { code: 'PLUS100', title: 'Nexora Plus offer', description: '₹100 off for Nexora Plus members', available: plusMember }
    ],
    history: db.prepare(`
      SELECT id, order_id, coins, description, created_at
      FROM reward_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 20
    `).all(userId)
  };
};
app.get('/api/rewards', requireAuth, (req, res) => {
  res.json({ rewards: readRewards(req.user.id) });
});
const giftCardAmounts = [500, 1000, 2000, 5000];
const readGiftCards = (userId) => {
  db.prepare('INSERT OR IGNORE INTO gift_card_wallets (user_id) VALUES (?)').run(userId);
  return {
    balance: db.prepare('SELECT balance FROM gift_card_wallets WHERE user_id = ?').get(userId).balance,
    cards: db.prepare(`
      SELECT id, code_last_four, amount, status, created_at, redeemed_at
      FROM gift_cards WHERE purchaser_user_id = ? ORDER BY id DESC LIMIT 20
    `).all(userId)
  };
};
app.get('/api/gift-cards', requireAuth, (req, res) => {
  res.json({ giftCards: readGiftCards(req.user.id) });
});
app.post('/api/gift-cards/purchase', requireAuth, (req, res, next) => {
  try {
    const amount = integer(req.body?.amount, 'amount');
    if (!giftCardAmounts.includes(amount)) throw fail(`amount must be one of: ${giftCardAmounts.join(', ')}`);
    const groups = crypto.randomBytes(6).toString('hex').toUpperCase().match(/.{1,4}/g);
    const code = `NEXO-${groups.join('-')}`;
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const result = db.prepare(`
      INSERT INTO gift_cards (purchaser_user_id, code_hash, code_last_four, amount)
      VALUES (?, ?, ?, ?)
    `).run(req.user.id, codeHash, code.slice(-4), amount);
    res.status(201).json({
      card: { id: result.lastInsertRowid, amount, status: 'issued', code, message: 'Demo code created. No payment was collected.' },
      giftCards: readGiftCards(req.user.id)
    });
  } catch (error) { next(error); }
});
app.post('/api/gift-cards/redeem', requireAuth, (req, res, next) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase();
    if (!/^NEXO-(?:[A-F0-9]{4}-){2}[A-F0-9]{4}$/.test(code)) throw fail('Enter a valid Nexora gift card code');
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const redeem = db.transaction(() => {
      const card = db.prepare('SELECT id, amount, status FROM gift_cards WHERE code_hash = ?').get(codeHash);
      if (!card) throw fail('Gift card code was not found', 404);
      if (card.status !== 'issued') throw fail('This gift card has already been redeemed', 409);
      const updated = db.prepare(`
        UPDATE gift_cards SET status = 'redeemed', redeemer_user_id = ?, redeemed_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'issued'
      `).run(req.user.id, card.id);
      if (!updated.changes) throw fail('This gift card has already been redeemed', 409);
      db.prepare('INSERT OR IGNORE INTO gift_card_wallets (user_id) VALUES (?)').run(req.user.id);
      db.prepare(`
        UPDATE gift_card_wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
      `).run(card.amount, req.user.id);
      db.prepare(`
        INSERT INTO gift_card_transactions (user_id, gift_card_id, amount, transaction_type, description)
        VALUES (?, ?, ?, 'redeem', ?)
      `).run(req.user.id, card.id, card.amount, `Redeemed Nexora gift card ${card.id}`);
      return card;
    })();
    res.json({ redeemedAmount: redeem.amount, giftCards: readGiftCards(req.user.id) });
  } catch (error) { next(error); }
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
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw fail('Each cart item must be an object');
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
    const products = items.length
      ? db.prepare(`SELECT id, stock, active FROM products WHERE id IN (${items.map(() => '?').join(', ')})`)
        .all(...items.map((item) => item.product_id))
      : [];
    const productsById = new Map(products.map((product) => [product.id, product]));
    const replaceCart = db.transaction(() => {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
      const insert = db.prepare(`
        INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `);
      items.forEach((item) => {
        const product = productsById.get(item.product_id);
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
    'image_url', oi.image_url, 'image_class', oi.image_class, 'category', oi.category,
    'fulfillment_status', oi.fulfillment_status, 'shipped_at', oi.shipped_at,
    'delivered_at', oi.delivered_at, 'tracking_provider', oi.tracking_provider,
    'tracking_number', oi.tracking_number, 'tracking_url', oi.tracking_url,
    'tracking_updated_at', oi.tracking_updated_at, 'return_id', r.id, 'return_status', r.status,
    'return_reason', r.reason, 'refund_status', r.refund_status,
    'refund_review_required', r.refund_review_required)) AS items
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN order_returns r ON r.order_item_id = oi.id
  WHERE o.user_id = ? GROUP BY o.id ORDER BY o.id DESC
`).all(userId).map((order) => ({ ...order, items: JSON.parse(order.items) }));
app.get('/api/orders', requireAuth, (req, res) => res.json({ orders: orderRows(req.user.id) }));
const refreshOrderStatus = (orderId) => {
  const statuses = db.prepare('SELECT fulfillment_status FROM order_items WHERE order_id = ?').all(orderId)
    .map((item) => item.fulfillment_status);
  const status = statuses.length && statuses.every((value) => value === 'cancelled')
    ? 'cancelled'
    : statuses.length && statuses.every((value) => value === 'delivered')
      ? 'delivered'
      : statuses.some((value) => value === 'shipped' || value === 'delivered')
        ? 'shipped'
        : statuses.some((value) => value === 'processing')
          ? 'processing'
          : 'pending';
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
};
app.post('/api/shipping/webhook', (req, res, next) => {
  const secret = process.env.SHIPPING_WEBHOOK_SECRET || '';
  const signature = req.get('x-shipping-signature') || '';
  if (Buffer.byteLength(secret, 'utf8') < 32 || !Buffer.isBuffer(req.rawBody)) {
    return res.status(503).json({ error: 'Shipping webhook is not configured' });
  }
  const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
  if (!safeSignatureEqual(expected, signature)) {
    return res.status(401).json({ error: 'Invalid shipping webhook signature' });
  }
  try {
    const { provider, tracking_number: trackingNumber, status } = JSON.parse(req.rawBody.toString('utf8'));
    if (typeof provider !== 'string' || !provider.trim() || typeof trackingNumber !== 'string'
      || !trackingNumber.trim() || !['shipped', 'in_transit', 'delivered'].includes(status)) {
      throw fail('Webhook must include provider, tracking_number, and a normalized shipment status');
    }
    const item = db.prepare(`
      SELECT id, order_id, fulfillment_status
      FROM order_items
      WHERE LOWER(tracking_provider) = LOWER(?) AND tracking_number = ?
    `).get(provider.trim(), trackingNumber.trim());
    if (!item) throw fail('Shipment not found', 404);
    if (status === 'delivered' && item.fulfillment_status === 'shipped') {
      const updateDelivery = db.transaction(() => {
        db.prepare(`UPDATE order_items SET fulfillment_status = 'delivered',
          delivered_at = CURRENT_TIMESTAMP, tracking_updated_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP WHERE id = ? AND fulfillment_status = 'shipped'`)
          .run(item.id);
        refreshOrderStatus(item.order_id);
      });
      updateDelivery();
    } else if (status === 'in_transit' || status === 'shipped') {
      if (!['shipped', 'delivered'].includes(item.fulfillment_status)) {
        throw fail('Shipment status cannot advance before the seller marks the item shipped', 409);
      }
      db.prepare('UPDATE order_items SET tracking_updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(item.id);
    } else if (status === 'delivered' && item.fulfillment_status !== 'delivered') {
      throw fail('Shipment status cannot advance before the seller marks the item shipped', 409);
    }
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});
app.post('/api/orders/:id/cancel', requireAuth, (req, res, next) => {
  try {
    const orderId = integer(req.params.id, 'id');
    const cancelOrder = db.transaction(() => {
      const order = db.prepare('SELECT id, payment_method, payment_status FROM orders WHERE id = ? AND user_id = ?')
        .get(orderId, req.user.id);
      if (!order) throw fail('Order not found', 404);
      if (order.payment_method === 'razorpay' && order.payment_status === 'captured') {
        throw fail('Paid orders cannot be cancelled online yet. Contact Nexora support for cancellation and refund assistance.', 409);
      }
      const items = db.prepare('SELECT fulfillment_status FROM order_items WHERE order_id = ?').all(orderId);
      if (!items.length || items.some((item) => item.fulfillment_status !== 'pending')) {
        throw fail('Orders can only be cancelled before the seller starts processing them', 409);
      }
      if (order.payment_method === 'cod') {
        db.prepare(`
          UPDATE products SET stock = stock + (
            SELECT COALESCE(SUM(quantity), 0) FROM order_items
            WHERE order_id = ? AND product_id = products.id
          ), updated_at = CURRENT_TIMESTAMP
          WHERE id IN (SELECT product_id FROM order_items WHERE order_id = ? AND product_id IS NOT NULL)
        `).run(orderId, orderId);
      }
      db.prepare(`UPDATE order_items SET fulfillment_status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`).run(orderId);
      refreshOrderStatus(orderId);
    });
    cancelOrder();
    res.json({ order: orderRows(req.user.id).find((order) => order.id === orderId) });
  } catch (error) { next(error); }
});
app.post('/api/orders/:id/returns', requireAuth, (req, res, next) => {
  try {
    const orderId = integer(req.params.id, 'id');
    const { order_item_ids: orderItemIds, reason } = req.body || {};
    if (!Array.isArray(orderItemIds) || !orderItemIds.length || orderItemIds.length > 100) {
      throw fail('Choose at least one delivered product to return');
    }
    if (typeof reason !== 'string' || reason.trim().length < 3 || reason.trim().length > 500) {
      throw fail('Return reason must be between 3 and 500 characters');
    }
    const order = db.prepare('SELECT id, payment_method, payment_status FROM orders WHERE id = ? AND user_id = ?')
      .get(orderId, req.user.id);
    if (!order) throw fail('Order not found', 404);
    if (order.payment_method === 'razorpay' && order.payment_status !== 'captured') {
      throw fail('Return requests are available only for paid orders', 409);
    }
    const ids = [...new Set(orderItemIds.map((id) => integer(id, 'order_item_id')))];
    if (ids.length !== orderItemIds.length) throw fail('Return products must be selected only once');
    const placeholders = ids.map(() => '?').join(', ');
    const items = db.prepare(`
      SELECT id, fulfillment_status, delivered_at,
        julianday('now') - julianday(delivered_at) AS days_since_delivery
      FROM order_items WHERE order_id = ? AND id IN (${placeholders})
    `).all(orderId, ...ids);
    if (items.length !== ids.length) throw fail('One or more products do not belong to this order', 404);
    if (items.some((item) => item.fulfillment_status !== 'delivered' || !item.delivered_at)) {
      throw fail('Return requests are available only after delivery', 409);
    }
    if (items.some((item) => !Number.isFinite(item.days_since_delivery)
      || item.days_since_delivery < 0 || item.days_since_delivery > 7)) {
      throw fail('Return requests must be submitted within 7 days of delivery', 409);
    }
    const addReturns = db.transaction(() => {
      const insert = db.prepare(`INSERT INTO order_returns
        (order_id, order_item_id, user_id, reason, refund_review_required) VALUES (?, ?, ?, ?, ?)`);
      const refundReviewRequired = Number(order.payment_method === 'razorpay' && order.payment_status === 'captured');
      ids.forEach((id) => insert.run(orderId, id, req.user.id, reason.trim(), refundReviewRequired));
    });
    addReturns();
    res.status(201).json({ order: orderRows(req.user.id).find((entry) => entry.id === orderId) });
  } catch (error) {
    next(error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? fail('A return request already exists for one or more selected products', 409) : error);
  }
});
const createCheckoutOrder = (req, { paymentMethod, paymentStatus, orderStatus }) => {
  const {
    items,
    address_id: addressId,
    address,
    coupon,
    use_gift_card_balance: useGiftCardBalance = false
  } = req.body || {};
  if (typeof useGiftCardBalance !== 'boolean') throw fail('use_gift_card_balance must be boolean');
  if (useGiftCardBalance) throw fail('Gift card balance cannot be applied to online payments yet.');
  if (!Array.isArray(items) || !items.length || items.length > 100) {
    throw fail('Order must contain between 1 and 100 items');
  }
  let resolvedAddressId = addressId || null;
  if (resolvedAddressId && !db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(resolvedAddressId, req.user.id)) {
    throw fail('Address not found', 404);
  }
  if (!resolvedAddressId && !validAddress({ ...(address || {}), label: address?.label || 'Home' })) {
    throw fail('A valid delivery address is required');
  }
  const normalizedMap = new Map();
  items.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw fail('Each order item must be an object');
    return {
      productId: integer(item.product_id || item.productId, 'product_id'),
      quantity: integer(item.quantity, 'quantity')
    };
  })
    .forEach((item) => {
      if (!item.quantity || item.quantity > 99) throw fail('quantity must be between 1 and 99');
      normalizedMap.set(item.productId, (normalizedMap.get(item.productId) || 0) + item.quantity);
    });
  const normalized = [...normalizedMap.entries()].map(([productId, quantity]) => ({ productId, quantity }));
  const createOrder = db.transaction(() => {
    const productRows = normalized.length
      ? db.prepare(`SELECT id, name, price, stock, active, image_url, image_class, category, seller_user_id
        FROM products WHERE id IN (${normalized.map(() => '?').join(', ')})`)
        .all(...normalized.map((item) => item.productId))
      : [];
    const productsById = new Map(productRows.map((product) => [product.id, product]));
    const products = normalized.map((item) => ({ ...item, product: productsById.get(item.productId) }));
    if (products.some((item) => !item.product || !item.product.active)) throw fail('One or more products are unavailable', 404);
    products.forEach((item) => {
      if (item.product.stock < item.quantity) throw fail(`Insufficient stock for ${item.product.name}`, 409);
    });
    const subtotal = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = paymentMethod === 'cod'
      ? subtotal > 0 && subtotal < codFreeShippingThreshold ? 40 : 0
      : subtotal > 0 ? 40 : 0;
    const currentRewardsCoins = readRewards(req.user.id).coins;
    const discount = coupon === 'SAVE100' && subtotal >= 999
      ? 100
      : coupon === 'BANK10'
        ? Math.round(subtotal * 0.1)
        : coupon === 'FREEDEL' ? deliveryFee
          : coupon === 'PLUS100' && currentRewardsCoins >= plusMembershipCoins
            ? 100 : 0;
    if (coupon === 'PLUS100' && currentRewardsCoins < plusMembershipCoins) {
      throw fail('Nexora Plus membership is required for PLUS100');
    }
    const total = subtotal + deliveryFee - discount;
    if (paymentMethod === 'razorpay' && total < 1) throw fail('The payment amount must be at least ₹1');
    if (paymentMethod === 'cod') {
      const reserveStock = db.prepare(`
        UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1 AND stock >= ?
      `);
      for (const item of products) {
        if (!reserveStock.run(item.quantity, item.product.id, item.quantity).changes) {
          throw fail(`Insufficient stock for ${item.product.name}`, 409);
        }
      }
    }
    let orderAddress = resolvedAddressId
      ? db.prepare('SELECT name, mobile, line, pincode FROM addresses WHERE id = ? AND user_id = ?').get(resolvedAddressId, req.user.id)
      : null;
    if (!resolvedAddressId) {
      const savedAddress = db.prepare(`
        INSERT INTO addresses (user_id, label, name, mobile, line, pincode)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(req.user.id, address.label || 'Home', address.name.trim(), address.mobile, address.line.trim(), address.pincode);
      resolvedAddressId = savedAddress.lastInsertRowid;
      orderAddress = { name: address.name.trim(), mobile: address.mobile, line: address.line.trim(), pincode: address.pincode };
    }
    const order = db.prepare(`INSERT INTO orders
      (user_id, address_id, status, subtotal, delivery_fee, discount, gift_card_discount,
       payment_method, payment_status, address_name, address_mobile, address_line, address_pincode, total)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)`).run(
      req.user.id, resolvedAddressId, orderStatus, subtotal, deliveryFee, discount, paymentMethod,
      paymentStatus, orderAddress.name, orderAddress.mobile, orderAddress.line, orderAddress.pincode, total
    );
    const addItem = db.prepare(`INSERT INTO order_items
      (order_id, product_id, product_name, unit_price, quantity, image_url, image_class, category, seller_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    products.forEach((item) => addItem.run(order.lastInsertRowid, item.product.id, item.product.name, item.product.price,
      item.quantity, item.product.image_url, item.product.image_class, item.product.category, item.product.seller_user_id));
    return {
      id: order.lastInsertRowid,
      subtotal,
      deliveryFee,
      discount,
      total,
      items: products.map(({ product, quantity }) => ({
        name: product.name,
        unit_price: product.price,
        quantity
      }))
    };
  })();
  return createOrder;
};

app.post('/api/payments/razorpay/orders', requireAuth, async (req, res, next) => {
  const settings = razorpaySettings();
  if (!settings.enabled || (settings.mode === 'live' && !req.secure)) {
    return res.status(503).json({ error: 'Razorpay is not configured for this secure environment.' });
  }
  try {
    const order = createCheckoutOrder(req, {
      paymentMethod: 'razorpay',
      paymentStatus: 'created',
      orderStatus: 'payment_pending'
    });
    let providerOrder;
    try {
      providerOrder = await razorpayRequest('POST', '/orders', {
        amount: order.total * 100,
        currency: 'INR',
        receipt: `nx_${order.id}`,
        notes: { nexora_order_id: String(order.id), nexora_user_id: String(req.user.id) }
      });
      if (!providerOrder.id || providerOrder.amount !== order.total * 100 || providerOrder.currency !== 'INR') {
        throw fail('Payment provider returned an invalid order', 502);
      }
    } catch (error) {
      db.prepare(`UPDATE orders SET payment_status = 'failed', status = 'payment_failed' WHERE id = ?`).run(order.id);
      throw error;
    }
    db.prepare('UPDATE orders SET razorpay_order_id = ? WHERE id = ?').run(providerOrder.id, order.id);
    res.status(201).json({
      order_id: order.id,
      key_id: settings.keyId,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      razorpay_order_id: providerOrder.id,
      mode: settings.mode,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      discount: order.discount,
      total: order.total,
      items: order.items
    });
  } catch (error) { next(error); }
});

app.post('/api/orders/cod', requireAuth, async (req, res, next) => {
  if (!codEnabled) return res.status(503).json({ error: 'Cash on delivery is disabled until production storage is ready.' });
  try {
    const order = createCheckoutOrder(req, {
      paymentMethod: 'cod',
      paymentStatus: 'pending_collection',
      orderStatus: 'pending'
    });
    const notification = createInAppNotification(
      req.user.id,
      'order',
      'Order placed',
      `Order #${order.id} is confirmed. Pay cash on delivery.`
    );
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(req.user.id);
    let emailResult = { sent: false, reason: 'email_unavailable' };
    if (user?.email) {
      emailResult = await sendTransactionalEmail({
        to: user.email,
        subject: `Nexora order #${order.id} confirmed`,
        text: `Your order #${order.id} is confirmed. Total: ₹${order.total}. Pay cash on delivery.`,
        html: `<p>Your order <strong>#${order.id}</strong> is confirmed.</p><p>Total: ₹${order.total}. Pay cash on delivery.</p>`
      });
      if (!emailResult.sent) console.warn(`Order ${order.id} confirmation email was not delivered (${emailResult.reason}).`);
    }
    res.status(201).json({
      order: orderRows(req.user.id).find((entry) => entry.id === order.id),
      notification,
      email_sent: emailResult.sent
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/payments/razorpay/verify', requireAuth, async (req, res, next) => {
  const settings = razorpaySettings();
  if (!settings.enabled || (settings.mode === 'live' && !req.secure)) {
    return res.status(503).json({ error: 'Razorpay is not configured for this secure environment.' });
  }
  try {
    const { order_id: orderIdValue, razorpay_order_id: providerOrderId,
      razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    const orderId = integer(orderIdValue, 'order_id');
    if (![providerOrderId, paymentId].every((value) => typeof value === 'string' && value.length > 0)) {
      throw fail('Payment verification details are incomplete');
    }
    const order = db.prepare(`SELECT * FROM orders WHERE id = ? AND user_id = ?
      AND payment_method = 'razorpay' AND razorpay_order_id = ?`).get(orderId, req.user.id, providerOrderId);
    if (!order) throw fail('Payment order not found', 404);
    const expected = crypto.createHmac('sha256', settings.keySecret)
      .update(`${providerOrderId}|${paymentId}`).digest('hex');
    if (!safeSignatureEqual(expected, signature)) throw fail('Payment signature is invalid', 400);

    let payment = await razorpayRequest('GET', `/payments/${encodeURIComponent(paymentId)}`);
    if (payment.order_id !== providerOrderId || payment.amount !== order.total * 100 || payment.currency !== 'INR') {
      throw fail('Payment details do not match this order', 409);
    }
    if (payment.status === 'authorized') {
      payment = await razorpayRequest('POST', `/payments/${encodeURIComponent(paymentId)}/capture`, {
        amount: order.total * 100,
        currency: 'INR'
      });
    }
    if (payment.status !== 'captured') {
      if (payment.status === 'failed') {
        db.prepare(`UPDATE orders SET payment_status = 'failed', status = 'payment_failed'
          WHERE id = ? AND payment_status = 'created'`).run(order.id);
      }
      throw fail('Payment has not been captured. Check the payment status and try again.', 409);
    }
    const updatedOrder = applyCapturedPayment(order.id, paymentId);
    if (updatedOrder.payment_status === 'captured' && updatedOrder.razorpay_payment_id !== paymentId) {
      throw fail('A payment was already confirmed for this order. Contact Nexora support about the additional payment.', 409);
    }
    if (updatedOrder.payment_status === 'paid_stock_issue') {
      throw fail('Payment was received, but stock changed before confirmation. Contact Nexora support for a refund.', 409);
    }
    res.json({ order: orderRows(req.user.id).find((entry) => entry.id === order.id) });
  } catch (error) { next(error); }
});

app.post('/api/orders', requireAuth, (req, res, next) => {
  try {
    const { payment_method: paymentMethod = 'demo' } = req.body || {};
    if (paymentMethod !== 'demo') throw fail('Use the secure online checkout for payments.');
    const order = createCheckoutOrder(req, {
      paymentMethod: 'demo',
      paymentStatus: 'not_collected',
      orderStatus: 'pending'
    });
    res.status(201).json({
      order: orderRows(req.user.id).find((entry) => entry.id === order.id),
      rewards: readRewards(req.user.id),
      giftCards: readGiftCards(req.user.id)
    });
  } catch (error) { next(error); }
});

app.use('/assets/uploads/sellers', express.static(sellerUploadRoot, {
  maxAge: '1y',
  immutable: true
}));
app.get('/assets/banner-home.svg', (req, res, next) => res.sendFile(path.join(__dirname, 'assets', 'banner-home.svg'), { maxAge: '1h' }, next));
app.get('/assets/banner-style.svg', (req, res, next) => res.sendFile(path.join(__dirname, 'assets', 'banner-style.svg'), { maxAge: '1h' }, next));
app.get('/assets/banner-tech.svg', (req, res, next) => res.sendFile(path.join(__dirname, 'assets', 'banner-tech.svg'), { maxAge: '1h' }, next));
app.get('/assets/nexora-icon.png', (req, res, next) => res.sendFile(path.join(__dirname, 'assets', 'nexora-icon.png'), { maxAge: '1h' }, next));
app.get('/Script.js', (req, res, next) => res.sendFile(path.join(__dirname, 'Script.js'), { headers: { 'Cache-Control': 'no-cache' } }, next));
app.get('/Style.css', (req, res, next) => res.sendFile(path.join(__dirname, 'Style.css'), { headers: { 'Cache-Control': 'no-cache' } }, next));
app.get('/Index.html', (req, res, next) => res.sendFile(publicFile, { headers: { 'Cache-Control': 'no-cache' } }, next));
app.get('/', (req, res, next) => res.sendFile(publicFile, { headers: { 'Cache-Control': 'no-cache' } }, next));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large.' });
  }
  if (error.expose && Number.isInteger(error.status) && error.status >= 400 && error.status < 600) {
    return res.status(error.status).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) app.listen(port, () => console.log(`Nexora server listening on port ${port}`));
module.exports = app;
