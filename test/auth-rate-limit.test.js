const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'production';
process.env.SEED_DEMO_DATA = 'false';

const app = require('../server');
const db = require('../db');

test('limits repeated authentication attempts without changing successful auth flows', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const url = `http://127.0.0.1:${address.port}/api/auth/login`;

  try {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `missing-${attempt}@example.com`, password: 'InvalidPass123' })
      });
      assert.equal(response.status, 401);
    }

    const limited = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'blocked@example.com', password: 'InvalidPass123' })
    });
    assert.equal(limited.status, 429);
    assert.match((await limited.json()).error, /Too many authentication attempts/);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
