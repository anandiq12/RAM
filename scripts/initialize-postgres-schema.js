const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'postgres-schema.sql');

const initializePostgresSchema = async (client) => {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await client.query(schema);
};

module.exports = { initializePostgresSchema, schemaPath };
