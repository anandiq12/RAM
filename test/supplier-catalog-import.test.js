const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';
process.env.ADMIN_KEY = 'supplier-catalog-import-test-key';

const app = require('../server');
const db = require('../db');
const { defaultCsvPath, importSupplierCatalog, parseSupplierCsv } = require('../scripts/import-supplier-catalog');

test('authorized sample CSV imports accurate product and image data through the supplier feed', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const apiBase = `http://127.0.0.1:${address.port}`;

  try {
    const feedResponse = await fetch(`${apiBase}/api/admin/supplier-feeds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: JSON.stringify({ name: 'Nexora' })
    });
    assert.equal(feedResponse.status, 201);
    const { feed, api_key: apiKey } = await feedResponse.json();

    const result = await importSupplierCatalog(defaultCsvPath, { apiBase, apiKey });
    assert.deepEqual(result.results, { created: 3, updated: 0, total: 3 });
    const repeatImport = await importSupplierCatalog(defaultCsvPath, { apiBase, apiKey });
    assert.deepEqual(repeatImport.results, { created: 0, updated: 3, total: 3 });

    const products = db.prepare(`
      SELECT sku, name, category, subcategory, brand, price, stock, image_url, images_json, rating, reviews,
        source_feed_id, external_product_id
      FROM products WHERE source_feed_id = ? ORDER BY sku
    `).all(feed.id);
    assert.deepEqual(products.map((product) => ({
      sku: product.sku,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      images_json: JSON.parse(product.images_json),
      rating: product.rating,
      reviews: product.reviews,
      external_product_id: product.external_product_id
    })), [
      {
        sku: 'NEX-001',
        name: 'Wireless Bluetooth Earbuds',
        category: 'Electronics',
        subcategory: '',
        brand: 'Unbranded',
        price: 1499,
        stock: 50,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
        images_json: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'],
        rating: 0,
        reviews: 0,
        external_product_id: 'NEX-001'
      },
      {
        sku: 'NEX-002',
        name: 'Smart Fitness Watch',
        category: 'Electronics',
        subcategory: 'Wearables',
        brand: 'Unbranded',
        price: 2999,
        stock: 30,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        images_json: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
        rating: 0,
        reviews: 0,
        external_product_id: 'NEX-002'
      },
      {
        sku: 'NEX-003',
        name: 'Ergonomic Laptop Stand',
        category: 'Electronics',
        subcategory: 'Accessories',
        brand: 'Unbranded',
        price: 899,
        stock: 100,
        image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
        images_json: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'],
        rating: 0,
        reviews: 0,
        external_product_id: 'NEX-003'
      }
    ]);

    const publicResponse = await fetch(`${apiBase}/api/products?q=${encodeURIComponent('Smart Fitness Watch')}`);
    assert.equal(publicResponse.status, 200);
    const publicProduct = (await publicResponse.json()).products[0];
    assert.equal(publicProduct.image_url, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30');
    assert.equal(publicProduct.subcategory, 'Wearables');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});

test('supplier CSV rejects unsupported categories and non-HTTPS images', () => {
  const csv = [
    'sku,title,price,stock,image_url,category',
    'NEX-004,Test product,100,1,http://images.example.test/product.jpg,Electronics'
  ].join('\n');
  assert.throws(() => parseSupplierCsv(csv), /image URL must use HTTPS/);

  const unsupportedCategory = [
    'sku,title,price,stock,image_url,category',
    'NEX-005,Test product,100,1,https://images.example.test/product.jpg,Unknown'
  ].join('\n');
  assert.throws(() => parseSupplierCsv(unsupportedCategory), /unsupported category "Unknown"/);
});
