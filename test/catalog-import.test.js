const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';
process.env.ADMIN_KEY = 'catalog-import-test-key';

const app = require('../server');
const db = require('../db');

test('CSV imports update matching products and expose accurate paginated inventory', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const importCsv = (csv) => fetch(`${baseUrl}/api/admin/products/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/csv',
      'x-admin-key': process.env.ADMIN_KEY
    },
    body: csv
  });

  try {
    const firstImport = await importCsv([
      'name,category,brand,price,sku,stock',
      'Catalog Test Phone,Mobiles,Nexora,12000,NX-TEST-001,12'
    ].join('\n'));
    assert.equal(firstImport.status, 200);
    assert.deepEqual((await firstImport.json()).results, { created: 1, updated: 0, total: 1 });

    const repeatImport = await importCsv([
      'name,category,brand,price,sku,stock',
      'Catalog Test Phone,Mobiles,Nexora,11500,NX-TEST-001,8'
    ].join('\n'));
    assert.equal(repeatImport.status, 200);
    assert.deepEqual((await repeatImport.json()).results, { created: 0, updated: 1, total: 1 });

    const listing = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent('Catalog Test Phone')}&limit=1`);
    assert.equal(listing.status, 200);
    const payload = await listing.json();
    assert.equal(payload.pagination.total, 1);
    assert.equal(payload.pagination.hasMore, false);
    assert.equal(payload.products[0].price, 11500);
    assert.equal(payload.products[0].stock, 8);
    const snapshot = await fetch(`${baseUrl}/api/products?id=${payload.products[0].id}&id=${payload.products[0].id}&limit=100`);
    assert.equal(snapshot.status, 200);
    assert.equal(snapshot.headers.get('cache-control'), 'no-store');
    const snapshotPayload = await snapshot.json();
    assert.equal(snapshotPayload.products.length, 1);
    assert.equal(snapshotPayload.products[0].price, 11500);
    assert.equal(snapshotPayload.products[0].stock, 8);
    const invalidSnapshot = await fetch(`${baseUrl}/api/products?id=0`);
    assert.equal(invalidSnapshot.status, 400);

    const cursorFirst = await fetch(`${baseUrl}/api/products?active=1&limit=2&sort=-newest&cursor=start`);
    assert.equal(cursorFirst.status, 200);
    const cursorFirstPage = await cursorFirst.json();
    assert.equal(cursorFirstPage.pagination.total, null);
    assert.equal(cursorFirstPage.products.length, 2);
    assert.ok(cursorFirstPage.pagination.nextCursor);
    const cursorNext = await fetch(`${baseUrl}/api/products?active=1&limit=2&sort=-newest&cursor=${encodeURIComponent(cursorFirstPage.pagination.nextCursor)}`);
    assert.equal(cursorNext.status, 200);
    const cursorNextPage = await cursorNext.json();
    assert.equal(cursorNextPage.products.length, 2);
    assert.ok(!cursorFirstPage.products.some((first) => cursorNextPage.products.some((next) => next.id === first.id)));

    const prefixSearch = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent('Catalog Test Pho')}&limit=10`);
    assert.equal(prefixSearch.status, 200);
    assert.equal((await prefixSearch.json()).pagination.total, 1);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    worksheet.addRow(['name', 'category', 'brand', 'price', 'sku', 'stock']);
    worksheet.addRow(['Imported XLSX Product', 'Electronics', 'Nexora', 2499, 'NX-TEST-002', 5]);
    const xlsx = await workbook.xlsx.writeBuffer();
    const spreadsheetImport = await fetch(`${baseUrl}/api/admin/products/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: xlsx
    });
    assert.equal(spreadsheetImport.status, 200);
    assert.deepEqual((await spreadsheetImport.json()).results, { created: 1, updated: 0, total: 1 });

    const productDetails = await fetch(`${baseUrl}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: JSON.stringify({
        name: 'Catalog Details Test Product',
        category: 'Electronics',
        brand: 'Nexora',
        price: 2499,
        original_price: 2999,
        stock: 7,
        image_url: 'https://images.example.test/catalog-details.jpg',
        images_json: ['https://images.example.test/catalog-details.jpg'],
        description: 'A complete product description for the catalog.',
        specifications_json: { Display: '6.7 inch AMOLED', Battery: '5000 mAh', NFC: true }
      })
    });
    assert.equal(productDetails.status, 201);
    const savedProduct = (await productDetails.json()).product;
    assert.equal(savedProduct.price, 2499);
    assert.equal(savedProduct.original_price, 2999);
    assert.equal(savedProduct.image_url, 'https://images.example.test/catalog-details.jpg');
    assert.deepEqual(JSON.parse(savedProduct.images_json), ['https://images.example.test/catalog-details.jpg']);
    assert.equal(savedProduct.description, 'A complete product description for the catalog.');
    assert.deepEqual(JSON.parse(savedProduct.specifications_json), { Display: '6.7 inch AMOLED', Battery: '5000 mAh', NFC: true });

    const publicListing = await fetch(`${baseUrl}/api/products?q=${encodeURIComponent('Catalog Details Test Product')}`);
    assert.equal(publicListing.status, 200);
    const publicProduct = (await publicListing.json()).products.find((product) => product.id === savedProduct.id);
    assert.ok(publicProduct);
    assert.deepEqual(JSON.parse(publicProduct.specifications_json), { Display: '6.7 inch AMOLED', Battery: '5000 mAh', NFC: true });

    const invalidSpecifications = await fetch(`${baseUrl}/api/admin/products/${savedProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: JSON.stringify({ specifications_json: ['not', 'an object'] })
    });
    assert.equal(invalidSpecifications.status, 400);

    const formulaWorkbook = new ExcelJS.Workbook();
    const formulaSheet = formulaWorkbook.addWorksheet('Products');
    formulaSheet.addRow(['name', 'category', 'brand', 'price']);
    formulaSheet.addRow(['Unsafe Formula Product', 'Electronics', 'Nexora', { formula: '1+1' }]);
    const formulaImport = await fetch(`${baseUrl}/api/admin/products/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'x-admin-key': process.env.ADMIN_KEY
      },
      body: await formulaWorkbook.xlsx.writeBuffer()
    });
    assert.equal(formulaImport.status, 400);
    assert.match((await formulaImport.json()).error, /formula cells are not supported/);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
