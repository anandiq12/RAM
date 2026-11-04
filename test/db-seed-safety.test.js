const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Database = require('better-sqlite3');

test('demo products are opt-in and never overwrite a populated database', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nexora-seed-safety-'));
  const databasePath = path.join(directory, 'nexora.sqlite');
  const root = path.resolve(__dirname, '..');
  const initializeDatabase = (seedDemoData) => {
    const env = { ...process.env, DATABASE_PATH: databasePath, NODE_ENV: 'development' };
    if (seedDemoData === undefined) delete env.SEED_DEMO_DATA;
    else env.SEED_DEMO_DATA = seedDemoData;
    return spawnSync(process.execPath, ['-e', "const db = require('./db'); db.close();"], {
      cwd: root,
      env,
      encoding: 'utf8'
    });
  };

  try {
    const defaultStartup = initializeDatabase();
    assert.equal(defaultStartup.status, 0, defaultStartup.stderr);
    const db = new Database(databasePath);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM products').get().count, 0);
    db.prepare(`INSERT INTO products
      (name, price, original_price, stock, category, brand, rating, reviews, description)
      VALUES ('iPhone Pro Case', 1234, 1500, 7, 'Mobiles', 'Customer Brand', 2.5, 3, 'Existing customer listing')
    `).run();
    db.close();

    const optInStartup = initializeDatabase('true');
    assert.equal(optInStartup.status, 0, optInStartup.stderr);

    const verification = new Database(databasePath, { readonly: true });
    try {
      assert.deepEqual(verification.prepare(`SELECT name, price, original_price, stock, brand, rating, reviews, description
        FROM products`).get(), {
        name: 'iPhone Pro Case',
        price: 1234,
        original_price: 1500,
        stock: 7,
        brand: 'Customer Brand',
        rating: 2.5,
        reviews: 3,
        description: 'Existing customer listing'
      });
    } finally {
      verification.close();
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
