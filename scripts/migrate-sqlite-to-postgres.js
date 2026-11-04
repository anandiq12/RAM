const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { Pool } = require('pg');
const { initializePostgresSchema } = require('./initialize-postgres-schema');

const quoteIdentifier = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;
const maximumBatchParameters = 60_000;
const preferredBatchSize = 500;

const getTables = (sqlite) => {
  const shadowTables = new Set(sqlite.pragma('table_list')
    .filter((table) => table.type === 'shadow')
    .map((table) => table.name));
  return sqlite.prepare(`
    SELECT name, sql FROM sqlite_master
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all()
    .filter(({ name, sql }) => !shadowTables.has(name) && !/^\s*CREATE\s+VIRTUAL\s+TABLE/i.test(sql || ''))
    .map(({ name }) => name);
};

const orderTablesByDependencies = (sqlite, tables) => {
  const tableSet = new Set(tables);
  const dependencies = new Map(tables.map((table) => [
    table,
    new Set(sqlite.pragma(`foreign_key_list(${quoteIdentifier(table)})`)
      .map((foreignKey) => foreignKey.table)
      .filter((parent) => tableSet.has(parent) && parent !== table))
  ]));
  const ordered = [];
  const remaining = new Set(tables);
  while (remaining.size) {
    const ready = [...remaining].filter((table) =>
      [...dependencies.get(table)].every((parent) => !remaining.has(parent)));
    if (!ready.length) {
      throw new Error(`Cannot migrate cyclic foreign-key dependencies: ${[...remaining].join(', ')}`);
    }
    ready.forEach((table) => {
      ordered.push(table);
      remaining.delete(table);
    });
  }
  return ordered;
};

const createUpsert = (table, columns, primaryKey, identityColumns) => {
  if (!primaryKey.length) throw new Error(`SQLite table ${table} has no primary key`);
  const quotedColumns = columns.map(quoteIdentifier);
  const placeholders = columns.map((_, index) => `$${index + 1}`);
  const updates = columns.filter((column) => !primaryKey.includes(column));
  const conflict = updates.length
    ? `DO UPDATE SET ${updates.map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`).join(', ')}`
    : 'DO NOTHING';
  const overrideIdentity = columns.some((column) => identityColumns.has(column))
    ? ' OVERRIDING SYSTEM VALUE'
    : '';
  return `INSERT INTO ${quoteIdentifier('public')}.${quoteIdentifier(table)} (${quotedColumns.join(', ')})${overrideIdentity} VALUES (${placeholders.join(', ')}) ON CONFLICT (${primaryKey.map(quoteIdentifier).join(', ')}) ${conflict}`;
};

const createBatchUpsert = (table, columns, primaryKey, identityColumns, rowCount) => {
  if (!Number.isInteger(rowCount) || rowCount < 1) throw new Error('rowCount must be a positive integer');
  if (rowCount * columns.length > maximumBatchParameters) {
    throw new Error(`Batch exceeds PostgreSQL's ${maximumBatchParameters} parameter safety limit`);
  }
  if (!primaryKey.length) throw new Error(`SQLite table ${table} has no primary key`);
  const quotedColumns = columns.map(quoteIdentifier);
  const placeholders = Array.from({ length: rowCount }, (_, row) =>
    `(${columns.map((_, column) => `$${row * columns.length + column + 1}`).join(', ')})`);
  const updates = columns.filter((column) => !primaryKey.includes(column));
  const conflict = updates.length
    ? `DO UPDATE SET ${updates.map((column) => `${quoteIdentifier(column)} = EXCLUDED.${quoteIdentifier(column)}`).join(', ')}`
    : 'DO NOTHING';
  const overrideIdentity = columns.some((column) => identityColumns.has(column))
    ? ' OVERRIDING SYSTEM VALUE'
    : '';
  return `INSERT INTO ${quoteIdentifier('public')}.${quoteIdentifier(table)} (${quotedColumns.join(', ')})${overrideIdentity} VALUES ${placeholders.join(', ')} ON CONFLICT (${primaryKey.map(quoteIdentifier).join(', ')}) ${conflict}`;
};

const migrateTableRows = async (sqlite, client, table, columns, primaryKey, identityColumns) => {
  const batchSize = Math.max(1, Math.min(preferredBatchSize, Math.floor(maximumBatchParameters / columns.length)));
  const sourceRows = sqlite.prepare(`SELECT * FROM ${quoteIdentifier(table)} ORDER BY ${primaryKey.map(quoteIdentifier).join(', ')}`);
  const batch = [];
  let migrated = 0;
  const insertBatch = async () => {
    if (!batch.length) return;
    const query = createBatchUpsert(table, columns, primaryKey, identityColumns, batch.length);
    await client.query(query, batch.flatMap((row) => columns.map((column) => row[column])));
    migrated += batch.length;
    batch.length = 0;
  };
  for (const row of sourceRows.iterate()) {
    batch.push(row);
    if (batch.length >= batchSize) await insertBatch();
  }
  await insertBatch();
  return migrated;
};

const migrateSqliteToPostgres = async (sqlite, client) => {
  const tables = getTables(sqlite);
  const orderedTables = orderTablesByDependencies(sqlite, tables);
  const report = [];

  await client.query('BEGIN');
  try {
    const quotedTables = tables.map((table) => `${quoteIdentifier('public')}.${quoteIdentifier(table)}`);
    await client.query(`LOCK TABLE ${quotedTables.join(', ')} IN ACCESS EXCLUSIVE MODE`);
    const existingRows = await client.query(`
      SELECT ${tables.map((table) => `EXISTS (SELECT 1 FROM ${quoteIdentifier('public')}.${quoteIdentifier(table)} LIMIT 1) AS ${quoteIdentifier(table)}`).join(', ')}
    `);
    const populatedTables = tables.filter((table) => existingRows.rows[0]?.[table]);
    if (populatedTables.length) {
      throw new Error(`PostgreSQL destination is not empty (${populatedTables.join(', ')}); migration is restricted to an empty destination to protect existing data`);
    }
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    for (const table of orderedTables) {
      const sourceColumns = sqlite.pragma(`table_info(${quoteIdentifier(table)})`);
      const destination = await client.query(`
        SELECT column_name, is_identity, column_default, is_generated
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `, [table]);
      const destinationColumns = new Map(destination.rows.map((column) => [column.column_name, column]));
      if (!destinationColumns.size) {
        throw new Error(`PostgreSQL table public.${table} does not exist; initialize the app schema first`);
      }

      const missing = sourceColumns
        .filter((column) => !destinationColumns.has(column.name))
        .map((column) => column.name);
      if (missing.length) {
        throw new Error(`PostgreSQL table public.${table} is missing SQLite columns: ${missing.join(', ')}`);
      }
      const primaryKey = sourceColumns
        .filter((column) => column.pk > 0)
        .sort((left, right) => left.pk - right.pk)
        .map((column) => column.name);
      const columns = sourceColumns
        .filter((column) => destinationColumns.get(column.name).is_generated === 'NEVER')
        .map((column) => column.name);
      const identityColumns = new Set(columns.filter((column) =>
        destinationColumns.get(column).is_identity === 'YES'));
      const migrated = await migrateTableRows(sqlite, client, table, columns, primaryKey, identityColumns);

      for (const column of columns) {
        const definition = destinationColumns.get(column);
        if (definition.is_identity === 'YES' || (definition.column_default || '').startsWith('nextval(')) {
          const quotedTable = `${quoteIdentifier('public')}.${quoteIdentifier(table)}`;
          const quotedColumn = quoteIdentifier(column);
          await client.query(`
            SELECT setval(
              pg_get_serial_sequence($1, $2),
              COALESCE(MAX(${quotedColumn}), 1),
              MAX(${quotedColumn}) IS NOT NULL
            )
            FROM ${quotedTable}
          `, [`public.${table}`, column]);
        }
      }
      report.push({ table, rows: migrated });
    }
    await client.query(`
      UPDATE public.products AS product
      SET popularity = COALESCE((
        SELECT SUM(item.quantity) FROM public.order_items AS item
        WHERE item.product_id = product.id
      ), 0)
    `);
    await client.query('COMMIT');
    return report;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const run = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  const sourcePath = path.resolve(process.env.DATABASE_PATH || path.join(__dirname, '..', 'nexora.sqlite'));
  if (!databaseUrl) throw new Error('DATABASE_URL must point to the initialized PostgreSQL database');
  if (!fs.existsSync(sourcePath)) throw new Error(`SQLite source database does not exist: ${sourcePath}`);

  const sqlite = new Database(sourcePath, { readonly: true, fileMustExist: true });
  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const client = await pool.connect();
    try {
      await initializePostgresSchema(client);
      const report = await migrateSqliteToPostgres(sqlite, client);
      report.forEach(({ table, rows }) => console.log(`${table}: ${rows} rows`));
      console.log(`Migrated ${report.reduce((total, entry) => total + entry.rows, 0)} rows. SQLite source retained at ${sourcePath}`);
    } finally {
      client.release();
    }
  } finally {
    sqlite.close();
    await pool.end();
  }
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`SQLite-to-PostgreSQL migration failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  createUpsert,
  createBatchUpsert,
  getTables,
  initializePostgresSchema,
  migrateSqliteToPostgres,
  orderTablesByDependencies
};
