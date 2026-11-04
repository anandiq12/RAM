const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';
process.env.ADMIN_KEY = 'supplier-feed-test-key';

const app = require('../server');
const db = require('../db');

test('authorized supplier feed updates the same external product instead of duplicating it', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const headers = { 'Content-Type': 'application/json', 'x-admin-key': process.env.ADMIN_KEY };

  try {
    const createFeed = await fetch(`${baseUrl}/api/admin/supplier-feeds`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'Authorized Test Supplier' })
    });
    assert.equal(createFeed.status, 201);
    const { feed, api_key: apiKey } = await createFeed.json();

    db.prepare(`INSERT INTO products
      (name, price, stock, category, brand, sku, active)
      VALUES ('Admin-Owned Catalog Product', 7200, 6, 'Electronics', 'Nexora', 'ADMIN-OWNED-001', 1)
    `).run();
    const adminProductResponse = await fetch(`${baseUrl}/api/supplier/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-supplier-key': apiKey },
      body: JSON.stringify({
        products: [{
          external_product_id: 'supplier-admin-owned',
          name: 'Overwritten Catalog Product',
          category: 'Electronics',
          brand: 'Nexora',
          price: 1,
          sku: 'ADMIN-OWNED-001',
          stock: 0
        }]
      })
    });
    assert.equal(adminProductResponse.status, 409);
    assert.deepEqual(db.prepare(`SELECT name, price, stock, source_feed_id, external_product_id
      FROM products WHERE sku = 'ADMIN-OWNED-001'`).get(), {
      name: 'Admin-Owned Catalog Product',
      price: 7200,
      stock: 6,
      source_feed_id: null,
      external_product_id: null
    });

    const sendProducts = (price, stock, key = apiKey, sku = 'SUP-ITEM-001') => fetch(`${baseUrl}/api/supplier/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-supplier-key': key },
      body: JSON.stringify({
        products: [{
          external_product_id: 'supplier-item-001',
          name: 'Supplier Catalog Item',
          category: 'Electronics',
          brand: 'Nexora',
          price,
          sku,
          stock
        }]
      })
    });

    const firstSync = await sendProducts(2500, 7);
    assert.equal(firstSync.status, 200);
    assert.deepEqual((await firstSync.json()).results, { created: 1, updated: 0, total: 1 });
    const successState = await fetch(`${baseUrl}/api/admin/supplier-feeds`, { headers });
    const firstFeedState = (await successState.json()).feeds[0];
    assert.equal(firstFeedState.last_sync_status, 'success');
    assert.equal(firstFeedState.last_sync_count, 1);
    assert.equal(firstFeedState.last_sync_created, 1);
    assert.equal(firstFeedState.last_sync_updated, 0);

    const secondSync = await sendProducts(2399, 4, apiKey, 'SUP ITEM 001');
    assert.equal(secondSync.status, 200);
    assert.deepEqual((await secondSync.json()).results, { created: 0, updated: 1, total: 1 });
    const failedSync = await fetch(`${baseUrl}/api/supplier/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-supplier-key': apiKey },
      body: JSON.stringify({ products: [{ name: 'Missing required supplier fields' }] })
    });
    assert.equal(failedSync.status, 400);
    const failedFeedState = await fetch(`${baseUrl}/api/admin/supplier-feeds`, { headers });
    const failure = (await failedFeedState.json()).feeds[0];
    assert.equal(failure.last_sync_status, 'failed');
    assert.match(failure.last_sync_error, /product name, category, brand and price are required/);

    const stored = db.prepare(`
      SELECT id, price, stock, sku, source_feed_id, external_product_id
      FROM products WHERE source_feed_id = ? AND external_product_id = ?
    `).get(feed.id, 'supplier-item-001');
    assert.deepEqual(stored, {
      id: stored.id,
      price: 2399,
      stock: 4,
      sku: 'SUP ITEM 001',
      source_feed_id: feed.id,
      external_product_id: 'supplier-item-001'
    });
    assert.equal(db.prepare(`
      SELECT COUNT(*) AS count FROM products WHERE source_feed_id = ? AND external_product_id = ?
    `).get(feed.id, 'supplier-item-001').count, 1);
    const duplicateSkuBatch = await fetch(`${baseUrl}/api/supplier/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-supplier-key': apiKey },
      body: JSON.stringify({
        products: [
          { external_product_id: 'supplier-item-002', name: 'First Batch Item', category: 'Electronics', brand: 'Nexora', price: 2500, sku: 'DUP-BATCH-1' },
          { external_product_id: 'supplier-item-003', name: 'Second Batch Item', category: 'Electronics', brand: 'Nexora', price: 2600, sku: 'DUP-BATCH-1' }
        ]
      })
    });
    assert.equal(duplicateSkuBatch.status, 400);
    assert.equal(db.prepare("SELECT COUNT(*) AS count FROM products WHERE sku = 'DUP-BATCH-1'").get().count, 0);

    db.prepare(`
      INSERT INTO products (name, price, stock, category, brand, sku, model, active)
      VALUES ('Duplicate Review Item A', 999, 2, 'Electronics', 'Nexora', 'REVIEW-SKU-1', 'Review Model', 1),
        ('Duplicate Review Item B', 1099, 3, 'Electronics', 'Nexora', 'review sku 1', 'Review Model', 1),
        ('Duplicate No-SKU A', 499, 1, 'Garden & Outdoors', 'Test Brand', NULL, 'Test Model', 1),
        ('Duplicate No-SKU B', 599, 2, 'Garden & Outdoors', 'Test Brand', NULL, 'test model', 1)
    `).run();
    const duplicatesResponse = await fetch(`${baseUrl}/api/admin/products/duplicates?limit=100`, { headers });
    assert.equal(duplicatesResponse.status, 200);
    const duplicates = (await duplicatesResponse.json()).duplicates;
    const skuDuplicates = duplicates.find((group) => group.match_type === 'sku'
      && group.products.some((product) => product.name === 'Duplicate Review Item A'));
    const identityDuplicates = duplicates.find((group) => group.match_type === 'catalog_identity' && /test brand/i.test(group.match_value));
    assert.equal(skuDuplicates.products.length, 2);
    assert.equal(identityDuplicates.products.length, 2);

    const rotateResponse = await fetch(`${baseUrl}/api/admin/supplier-feeds/${feed.id}/rotate-key`, {
      method: 'POST',
      headers
    });
    assert.equal(rotateResponse.status, 200);
    const { api_key: rotatedKey } = await rotateResponse.json();
    assert.ok(rotatedKey && rotatedKey !== apiKey);
    assert.equal((await sendProducts(2300, 3)).status, 401);
    assert.equal((await sendProducts(2300, 3, rotatedKey)).status, 200);

    const pauseResponse = await fetch(`${baseUrl}/api/admin/supplier-feeds/${feed.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ active: false })
    });
    assert.equal(pauseResponse.status, 200);
    assert.equal((await sendProducts(2200, 2, rotatedKey)).status, 401);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
