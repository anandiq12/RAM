const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const keySecret = 'razorpay-test-secret';
const webhookSecret = 'razorpay-webhook-test-secret';
process.env.DATABASE_PATH = ':memory:';
process.env.RAZORPAY_MODE = 'test';
process.env.RAZORPAY_KEY_ID = 'rzp_test_nexora';
process.env.RAZORPAY_KEY_SECRET = keySecret;
process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;

const nativeFetch = global.fetch;
let providerOrder;
let capturedPayment;
global.fetch = async (input, options = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url);
  if (url.hostname !== 'api.razorpay.com') return nativeFetch(input, options);
  if (url.pathname === '/v1/orders' && options.method === 'POST') {
    const body = JSON.parse(options.body);
    providerOrder = { id: 'order_test_nexora_1', amount: body.amount, currency: body.currency };
    return new Response(JSON.stringify(providerOrder), { status: 200 });
  }
  if (url.pathname === '/v1/payments/pay_test_nexora_1' && options.method === 'GET') {
    return new Response(JSON.stringify({
      id: 'pay_test_nexora_1',
      order_id: providerOrder.id,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      status: 'authorized'
    }), { status: 200 });
  }
  if (url.pathname === '/v1/payments/pay_test_nexora_1/capture' && options.method === 'POST') {
    capturedPayment = {
      id: 'pay_test_nexora_1',
      order_id: providerOrder.id,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      status: 'captured'
    };
    return new Response(JSON.stringify(capturedPayment), { status: 200 });
  }
  return new Response(JSON.stringify({ error: { code: 'UNEXPECTED_TEST_REQUEST' } }), { status: 500 });
};

const app = require('../server');
const db = require('../db');

test('Razorpay checkout verifies/captures payments and decrements stock once', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (path, options = {}) => nativeFetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });

  try {
    const configResponse = await request('/api/payments/razorpay/config');
    assert.deepEqual(await configResponse.json(), {
      enabled: true,
      cod_enabled: true,
      mode: 'test',
      key_id: 'rzp_test_nexora'
    });

    const signupResponse = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Buyer', email: 'razorpay-test@example.com', password: 'TestPass123' })
    });
    assert.equal(signupResponse.status, 201);
    const { token } = await signupResponse.json();
    const headers = { Authorization: `Bearer ${token}` };

    db.prepare(`INSERT INTO products
      (name, price, stock, category, brand, rating, reviews, description, active)
      VALUES ('Razorpay Test Product', 2500, 5, 'Electronics', 'Test Brand', 4.5, 1, 'Payment test fixture', 1)
    `).run();
    const productsResponse = await request('/api/products?limit=100');
    const product = (await productsResponse.json()).products[0];
    const stockBefore = db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock;
    const createResponse = await request('/api/payments/razorpay/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        items: [{ product_id: product.id, quantity: 1 }],
        address: { label: 'Home', name: 'Test Buyer', mobile: '9876543210', line: '42 Test Road', pincode: '110001' }
      })
    });
    assert.equal(createResponse.status, 201);
    const paymentOrder = await createResponse.json();
    assert.equal(paymentOrder.amount, paymentOrder.total * 100);
    assert.equal(paymentOrder.currency, 'INR');
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore);

    const callback = {
      order_id: paymentOrder.order_id,
      razorpay_order_id: paymentOrder.razorpay_order_id,
      razorpay_payment_id: 'pay_test_nexora_1'
    };
    const invalidResponse = await request('/api/payments/razorpay/verify', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...callback, razorpay_signature: '0'.repeat(64) })
    });
    assert.equal(invalidResponse.status, 400);
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore);

    callback.razorpay_signature = crypto.createHmac('sha256', keySecret)
      .update(`${callback.razorpay_order_id}|${callback.razorpay_payment_id}`)
      .digest('hex');
    const verifyResponse = await request('/api/payments/razorpay/verify', {
      method: 'POST',
      headers,
      body: JSON.stringify(callback)
    });
    assert.equal(verifyResponse.status, 200);
    assert.equal(capturedPayment.status, 'captured');
    assert.equal((await verifyResponse.json()).order.payment_status, 'captured');
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore - 1);

    const event = {
      event: 'payment.captured',
      payload: { payment: { entity: capturedPayment } }
    };
    const rawEvent = JSON.stringify(event);
    const webhookSignature = crypto.createHmac('sha256', webhookSecret).update(rawEvent).digest('hex');
    const rejectedWebhook = await request('/api/payments/razorpay/webhook', {
      method: 'POST',
      headers: { 'x-razorpay-signature': '0'.repeat(64) },
      body: rawEvent
    });
    assert.equal(rejectedWebhook.status, 401);
    const webhookResponse = await request('/api/payments/razorpay/webhook', {
      method: 'POST',
      headers: { 'x-razorpay-signature': webhookSignature },
      body: rawEvent
    });
    assert.equal(webhookResponse.status, 200);
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore - 1);

    process.env.RAZORPAY_KEY_ID = 'invalid-key';
    const disabledConfig = await request('/api/payments/razorpay/config');
    assert.equal((await disabledConfig.json()).enabled, false);
    process.env.RAZORPAY_MODE = 'live';
    process.env.RAZORPAY_KEY_ID = 'rzp_live_nexora';
    const unsafeLiveConfig = await request('/api/payments/razorpay/config');
    assert.equal((await unsafeLiveConfig.json()).enabled, false);
  } finally {
    process.env.RAZORPAY_MODE = 'test';
    process.env.RAZORPAY_KEY_ID = 'rzp_test_nexora';
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    global.fetch = nativeFetch;
    db.close();
  }
});
