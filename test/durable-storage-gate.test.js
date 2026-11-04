const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.DATABASE_DURABLE = 'true';
process.env.NODE_ENV = 'production';
process.env.SEED_DEMO_DATA = 'true';
process.env.COD_ENABLED = 'true';
process.env.RAZORPAY_MODE = 'live';
process.env.RAZORPAY_KEY_ID = 'rzp_live_test_key';
process.env.RAZORPAY_KEY_SECRET = 'test-secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'test-webhook-secret';

const app = require('../server');
const db = require('../db');

test('temporary production storage keeps real-money checkout disabled', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const health = await fetch(`${baseUrl}/healthz`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), {
      status: 'ok',
      database: { engine: 'sqlite', durable: false }
    });

    const paymentConfig = await fetch(`${baseUrl}/api/payments/razorpay/config`);
    assert.deepEqual(await paymentConfig.json(), {
      enabled: false,
      cod_enabled: false,
      mode: 'live',
      key_id: null
    });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
