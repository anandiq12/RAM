const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'false';
process.env.ADMIN_KEY = 'catalog-scale-test-admin-key';

const app = require('../server');
const db = require('../db');

test('authorized supplier can import 5,000 listings and public catalog remains paginated', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-key': process.env.ADMIN_KEY
  };

  try {
    const createFeed = await fetch(`${baseUrl}/api/admin/supplier-feeds`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ name: 'Authorized 5K Scale Test Supplier' })
    });
    assert.equal(createFeed.status, 201);
    const { api_key: apiKey, feed } = await createFeed.json();

    const products = Array.from({ length: 5000 }, (_, index) => ({
      external_product_id: `scale-test-${index + 1}`,
      name: `Scale Test Listing ${String(index + 1).padStart(4, '0')}`,
      category: 'Electronics',
      brand: 'Authorized Test Brand',
      price: 1000 + index,
      sku: `SCALE-TEST-${String(index + 1).padStart(5, '0')}`,
      stock: 10
    }));
    const importResponse = await fetch(`${baseUrl}/api/supplier/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-supplier-key': apiKey },
      body: JSON.stringify({ products })
    });
    assert.equal(importResponse.status, 200);
    assert.deepEqual((await importResponse.json()).results, {
      created: 5000,
      updated: 0,
      total: 5000
    });
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM products WHERE source_feed_id = ?').get(feed.id).count, 5000);

    const firstPageResponse = await fetch(`${baseUrl}/api/products?category=Electronics&limit=100&cursor=start&sort=-newest`);
    assert.equal(firstPageResponse.status, 200);
    const firstPage = await firstPageResponse.json();
    assert.equal(firstPage.products.length, 100);
    assert.equal(firstPage.pagination.total, null);
    assert.ok(firstPage.pagination.nextCursor);

    const nextPageResponse = await fetch(`${baseUrl}/api/products?category=Electronics&limit=100&cursor=${encodeURIComponent(firstPage.pagination.nextCursor)}&sort=-newest`);
    assert.equal(nextPageResponse.status, 200);
    const nextPage = await nextPageResponse.json();
    assert.equal(nextPage.products.length, 100);
    assert.ok(!firstPage.products.some((first) => nextPage.products.some((next) => next.id === first.id)));

    const sourceRow = db.prepare(`
      SELECT source_feed_id, external_product_id
      FROM products WHERE sku = ?
    `).get('SCALE-TEST-05000');
    assert.deepEqual(sourceRow, { source_feed_id: feed.id, external_product_id: 'scale-test-5000' });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
