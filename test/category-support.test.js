const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'production';
process.env.SEED_DEMO_DATA = 'false';
process.env.ADMIN_KEY = 'category-support-test-key';

const app = require('../server');
const db = require('../db');

const expectedCategories = [
  'Fashion', 'Mobiles', 'Electronics', 'Home & Kitchen', 'Beauty & Personal Care',
  'Grocery', 'Furniture', 'Appliances', 'Footwear', 'Books', 'Toys & Games',
  'Sports & Fitness', 'Automotive', 'Jewellery & Watches', 'Health & Personal Care',
  'Baby & Kids', 'Pet Supplies', 'Office & Stationery', 'Musical Instruments',
  'Tools & Home Improvement', 'Luggage & Travel', 'Garden & Outdoors',
  'Arts, Crafts & Sewing', 'Digital Products', 'Industrial & Scientific',
  'Collectibles & Art'
];

test('production starts with complete product categories without demo listings', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM products').get().count, 0);

    const facetsResponse = await fetch(`${baseUrl}/api/products/facets`);
    assert.equal(facetsResponse.status, 200);
    assert.match(facetsResponse.headers.get('cache-control'), /public, max-age=30/);
    const facetsEtag = facetsResponse.headers.get('etag');
    assert.ok(facetsEtag);
    const facets = await facetsResponse.json();
    const cachedFacetsResponse = await fetch(`${baseUrl}/api/products/facets`, {
      headers: { 'If-None-Match': facetsEtag }
    });
    assert.equal(cachedFacetsResponse.status, 304);
    expectedCategories.forEach((category) => assert.ok(facets.categories.includes(category), `${category} is available`));
    expectedCategories.forEach((category) => {
      const categoryNode = facets.catalog.find((node) => node.name === category);
      assert.ok(categoryNode, `${category} has a catalog hierarchy`);
      assert.ok(categoryNode.subcategories.length, `${category} has subcategories`);
      assert.ok(categoryNode.subcategories.some((subcategory) =>
        subcategory.brands.some((brand) =>
          brand.product_types.some((productType) => productType.models.length))),
      `${category} has brand, product type, and model suggestions`);
    });

    const importResponse = await fetch(`${baseUrl}/api/admin/products/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/csv',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: [
        'name,category,brand,price,sku,stock',
        'Garden Test Product,Garden & Outdoors,Nexora,499,NX-GARDEN-001,3'
      ].join('\n')
    });
    assert.equal(importResponse.status, 200);

    const gardenProducts = await fetch(`${baseUrl}/api/products?category=${encodeURIComponent('Garden & Outdoors')}`);
    assert.equal(gardenProducts.status, 200);
    assert.equal(gardenProducts.headers.get('cache-control'), 'no-store');
    const payload = await gardenProducts.json();
    assert.equal(payload.pagination.total, 1);
    assert.equal(payload.products[0].category, 'Garden & Outdoors');

    for (const publicAsset of ['/Script.js', '/Style.css', '/assets/banner-style.svg']) {
      assert.equal((await fetch(`${baseUrl}${publicAsset}`)).status, 200, `${publicAsset} is served`);
    }
    for (const privateFile of ['/db.js', '/server.js', '/nexora.sqlite']) {
      assert.equal((await fetch(`${baseUrl}${privateFile}`)).status, 404, `${privateFile} is not served`);
    }

    db.prepare(`INSERT INTO products
      (name, price, stock, category, brand, active)
      VALUES ('Hidden Admin Listing', 1000, 1, 'Electronics', 'Nexora', 0)
    `).run();
    const hiddenSearch = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent('Hidden Admin Listing')}`);
    assert.equal(hiddenSearch.status, 200);
    assert.equal((await hiddenSearch.json()).products.length, 0);
    const inactiveRequest = await fetch(`${baseUrl}/api/products?active=0`);
    assert.equal(inactiveRequest.status, 400);

    assert.equal(db.pragma('busy_timeout', { simple: true }), 5000);
    assert.equal(db.pragma('cache_size', { simple: true }), -32768);
    const categoryPlan = db.prepare(`
      EXPLAIN QUERY PLAN SELECT id FROM products
      WHERE active = 1 AND LOWER(TRIM(category)) IN (LOWER(?))
    `).all('Garden & Outdoors').map((step) => step.detail).join(' ');
    assert.match(categoryPlan, /products_active_category_lookup/);
    const ordersPlan = db.prepare(`
      EXPLAIN QUERY PLAN SELECT id FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 10
    `).all(1).map((step) => step.detail).join(' ');
    assert.match(ordersPlan, /orders_user_id/);

    const createVariantProduct = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: JSON.stringify({
        name: 'Variant Test T-shirt',
        category: 'Fashion',
        subcategory: 'Men',
        brand: 'Levi’s',
        product_type: 'T-shirts',
        model: 'Variant Test Tee',
        price: 799,
        stock: 5,
        variants_json: {
          size: ['S', 'M', 'L'],
          color: ['Black', 'Blue'],
          material: ['Cotton', 'Linen']
        }
      })
    });
    assert.equal(createVariantProduct.status, 201);
    const variantPayload = await createVariantProduct.json();
    assert.deepEqual(JSON.parse(variantPayload.product.variants_json), {
      size: ['S', 'M', 'L'],
      color: ['Black', 'Blue'],
      material: ['Cotton', 'Linen']
    });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
