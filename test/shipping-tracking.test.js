const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'production';
process.env.COD_ENABLED = 'false';
process.env.SEED_DEMO_DATA = 'true';
process.env.SHIPPING_WEBHOOK_SECRET = 'shipping-webhook-test-secret-32-bytes';

const app = require('../server');
const db = require('../db');

test('real orders require tracking at shipment and signed carrier updates reach customers', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (url, options = {}) => fetch(`${baseUrl}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });

  try {
    const signupResponse = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Shipping Seller',
        email: 'shipping-seller@example.com',
        password: 'SecureShippingPass123'
      })
    });
    assert.equal(signupResponse.status, 201);
    const signup = await signupResponse.json();
    const auth = { Authorization: `Bearer ${signup.token}` };
    const userId = signup.user.id;
    const product = db.prepare('SELECT id FROM products WHERE active = 1 ORDER BY id LIMIT 1').get();
    db.prepare(`
      INSERT INTO seller_accounts (user_id, business_name, category, contact_phone, status)
      VALUES (?, 'Shipping Seller Store', 'Electronics', '9876543210', 'approved')
    `).run(userId);
    const orderId = db.prepare(`
      INSERT INTO orders (user_id, total, payment_method, payment_status, status)
      VALUES (?, 499, 'razorpay', 'captured', 'pending')
    `).run(userId).lastInsertRowid;
    const itemId = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, seller_user_id)
      VALUES (?, ?, 'Tracking Test Product', 499, 1, ?)
    `).run(orderId, product.id, userId).lastInsertRowid;
    const statusPath = `/api/seller/order-items/${itemId}/status`;

    const processing = await request(statusPath, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ status: 'processing' })
    });
    assert.equal(processing.status, 200);

    const missingTracking = await request(statusPath, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({ status: 'shipped' })
    });
    assert.equal(missingTracking.status, 409);

    const invalidUrl = await request(statusPath, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({
        status: 'shipped',
        tracking_provider: 'Shiprocket',
        tracking_number: 'NX12345',
        tracking_url: 'javascript:alert(1)'
      })
    });
    assert.equal(invalidUrl.status, 400);

    const shipped = await request(statusPath, {
      method: 'PATCH',
      headers: auth,
      body: JSON.stringify({
        status: 'shipped',
        tracking_provider: 'Shiprocket',
        tracking_number: 'NX12345',
        tracking_url: 'https://carrier.example/track/NX12345'
      })
    });
    assert.equal(shipped.status, 200);

    const payload = JSON.stringify({
      provider: 'Shiprocket',
      tracking_number: 'NX12345',
      status: 'in_transit'
    });
    const signature = crypto.createHmac('sha256', process.env.SHIPPING_WEBHOOK_SECRET).update(payload).digest('hex');
    const badSignature = await request('/api/shipping/webhook', {
      method: 'POST',
      headers: { 'x-shipping-signature': '0'.repeat(64) },
      body: payload
    });
    assert.equal(badSignature.status, 401);

    const inTransit = await request('/api/shipping/webhook', {
      method: 'POST',
      headers: { 'x-shipping-signature': signature },
      body: payload
    });
    assert.equal(inTransit.status, 200);

    const deliveredPayload = JSON.stringify({
      provider: 'Shiprocket',
      tracking_number: 'NX12345',
      status: 'delivered'
    });
    const deliveredSignature = crypto.createHmac('sha256', process.env.SHIPPING_WEBHOOK_SECRET)
      .update(deliveredPayload).digest('hex');
    const delivered = await request('/api/shipping/webhook', {
      method: 'POST',
      headers: { 'x-shipping-signature': deliveredSignature },
      body: deliveredPayload
    });
    assert.equal(delivered.status, 200);

    const customerOrders = await request('/api/orders', { headers: auth });
    assert.equal(customerOrders.status, 200);
    const order = (await customerOrders.json()).orders.find((entry) => entry.id === orderId);
    assert.equal(order.status, 'delivered');
    assert.equal(order.items[0].tracking_provider, 'Shiprocket');
    assert.equal(order.items[0].tracking_number, 'NX12345');
    assert.equal(order.items[0].tracking_url, 'https://carrier.example/track/NX12345');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
