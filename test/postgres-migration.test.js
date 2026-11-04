const test = require('node:test');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const {
  createUpsert,
  createBatchUpsert,
  getTables,
  initializePostgresSchema,
  migrateSqliteToPostgres,
  orderTablesByDependencies
} = require('../scripts/migrate-sqlite-to-postgres');

test('orders SQLite tables by foreign-key dependencies', () => {
  const sqlite = new Database(':memory:');
  try {
    sqlite.exec(`
      CREATE TABLE parents (id INTEGER PRIMARY KEY);
      CREATE TABLE children (id INTEGER PRIMARY KEY, parent_id INTEGER REFERENCES parents(id));
      CREATE TABLE grandchildren (id INTEGER PRIMARY KEY, child_id INTEGER REFERENCES children(id));
    `);
    const tables = getTables(sqlite);
    const ordered = orderTablesByDependencies(sqlite, tables);
    assert.ok(ordered.indexOf('parents') < ordered.indexOf('children'));
    assert.ok(ordered.indexOf('children') < ordered.indexOf('grandchildren'));
  } finally {
    sqlite.close();
  }
});

test('excludes SQLite FTS virtual and shadow tables from PostgreSQL data copies', () => {
  const sqlite = new Database(':memory:');
  try {
    sqlite.exec(`
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT);
      CREATE VIRTUAL TABLE products_fts USING fts5(name, content='products', content_rowid='id');
      CREATE TABLE catalog_search_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    `);
    const tables = getTables(sqlite);
    assert.ok(tables.includes('products'));
    assert.ok(tables.includes('catalog_search_metadata'));
    assert.ok(!tables.some((table) => table.startsWith('products_fts')));
  } finally {
    sqlite.close();
  }
});

test('builds retry-safe PostgreSQL upserts preserving explicit identity values', () => {
  const query = createUpsert('users', ['id', 'email', 'name'], ['id'], new Set(['id']));
  assert.equal(query,
    'INSERT INTO "public"."users" ("id", "email", "name") OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3) ON CONFLICT ("id") DO UPDATE SET "email" = EXCLUDED."email", "name" = EXCLUDED."name"');
});

test('builds bounded multi-row PostgreSQL upserts for migration batches', () => {
  const query = createBatchUpsert('users', ['id', 'email', 'name'], ['id'], new Set(['id']), 2);
  assert.equal(query,
    'INSERT INTO "public"."users" ("id", "email", "name") OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3), ($4, $5, $6) ON CONFLICT ("id") DO UPDATE SET "email" = EXCLUDED."email", "name" = EXCLUDED."name"');
  assert.throws(
    () => createBatchUpsert('users', ['id', 'email'], ['id'], new Set(), 30_001),
    /parameter safety limit/
  );
});

test('migrates source rows using bounded multi-row statements', async () => {
  const sqlite = new Database(':memory:');
  const statements = [];
  try {
    sqlite.exec(`
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
      INSERT INTO products VALUES (1, 'First'), (2, 'Second'), (3, 'Third');
    `);
    const client = {
      async query(sql) {
        statements.push(sql);
        if (sql.includes('SELECT EXISTS')) return { rows: [{ products: false }] };
        if (sql.includes('information_schema.columns')) {
          return { rows: [
            { column_name: 'id', is_identity: 'YES', column_default: null, is_generated: 'NEVER' },
            { column_name: 'name', is_identity: 'NO', column_default: null, is_generated: 'NEVER' }
          ] };
        }
        return { rows: [] };
      }
    };
    const report = await migrateSqliteToPostgres(sqlite, client);
    const inserts = statements.filter((sql) => sql.startsWith('INSERT INTO "public"."products"'));
    assert.equal(report[0].rows, 3);
    assert.equal(inserts.length, 1);
    assert.match(inserts[0], /VALUES \(\$1, \$2\), \(\$3, \$4\), \(\$5, \$6\)/);
    assert.ok(statements.includes('COMMIT'));
  } finally {
    sqlite.close();
  }
});

test('refuses to migrate into a populated PostgreSQL destination and rolls back', async () => {
  const sqlite = new Database(':memory:');
  const statements = [];
  try {
    sqlite.exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO products VALUES (1, \'Source product\');');
    const client = {
      async query(sql) {
        statements.push(sql);
        if (sql.includes('SELECT EXISTS')) return { rows: [{ products: true }] };
        return { rows: [] };
      }
    };
    await assert.rejects(
      migrateSqliteToPostgres(sqlite, client),
      /destination is not empty \(products\)/
    );
    assert.ok(statements.some((sql) => sql.includes('LOCK TABLE')));
    assert.equal(statements.at(-1), 'ROLLBACK');
    assert.ok(!statements.some((sql) => sql.includes('INSERT INTO "public"."products"')));
  } finally {
    sqlite.close();
  }
});

test('rejects SQLite foreign-key dependency cycles before copying rows', () => {
  const sqlite = new Database(':memory:');
  try {
    sqlite.exec(`
      CREATE TABLE first_table (id INTEGER PRIMARY KEY, second_id INTEGER REFERENCES second_table(id));
      CREATE TABLE second_table (id INTEGER PRIMARY KEY, first_id INTEGER REFERENCES first_table(id));
    `);
    assert.throws(() => orderTablesByDependencies(sqlite, getTables(sqlite)), /cyclic foreign-key dependencies/);
  } finally {
    sqlite.close();
  }
});

test('initializes every application table in PostgreSQL without demo records', async () => {
  const statements = [];
  await initializePostgresSchema({ query: async (sql) => statements.push(sql) });
  const schema = statements.join('\n');
  const tables = [...schema.matchAll(/CREATE TABLE IF NOT EXISTS ([a-z_]+)/g)].map((match) => match[1]);
  assert.deepEqual(tables.sort(), [
    'addresses', 'advertising_requests', 'cart_items', 'catalog_nodes', 'catalog_search_metadata', 'gift_card_transactions',
    'gift_card_wallets', 'gift_cards', 'notification_preferences', 'notifications', 'order_items', 'order_returns',
    'orders', 'product_reviews', 'products', 'reward_transactions', 'rewards_accounts', 'seller_accounts', 'sessions',
    'supplier_integrations', 'support_tickets', 'users', 'wishlist_items'
  ].sort());
  assert.match(schema, /GENERATED BY DEFAULT AS IDENTITY/);
  assert.match(schema, /ON DELETE CASCADE/);
  assert.match(schema, /products_search_document_gin/);
  assert.match(schema, /products_active_popularity_page/);
  assert.match(schema, /maintain_product_popularity/);
  assert.doesNotMatch(schema, /INSERT INTO (?:products|catalog_nodes)/i);
});
