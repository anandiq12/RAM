const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';
process.env.SENDGRID_API_KEY = 'sendgrid-test-key';
process.env.SENDGRID_FROM_EMAIL = 'orders@example.com';

const nativeFetch = global.fetch;
const sentEmails = [];
global.fetch = async (input, options = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url);
  if (url.hostname === 'api.sendgrid.com') {
    sentEmails.push(JSON.parse(options.body));
    return new Response(null, { status: 202 });
  }
  return nativeFetch(input, options);
};

const app = require('../server');
const db = require('../db');

test('COD checkout reserves stock, sends alerts, and restores stock when cancelled', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (path, options = {}) => nativeFetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });

  try {
    const signup = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'COD Buyer', email: 'cod-test@example.com', password: 'TestPass123' })
    });
    assert.equal(signup.status, 201);
    const { token } = await signup.json();
    const auth = { Authorization: `Bearer ${token}` };
    const productsResponse = await request('/api/products?limit=100');
    const product = (await productsResponse.json()).products[0];
    const stockBefore = db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock;

    const placed = await request('/api/orders/cod', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        items: [{ product_id: product.id, quantity: 1 }],
        address: { label: 'Home', name: 'COD Buyer', mobile: '9876543210', line: '42 Test Road', pincode: '110001' }
      })
    });
    assert.equal(placed.status, 201);
    const { order, notification, email_sent: emailSent } = await placed.json();
    assert.equal(order.payment_method, 'cod');
    assert.equal(order.payment_status, 'pending_collection');
    assert.equal(order.delivery_fee, order.subtotal >= 899 ? 0 : 40);
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore - 1);
    assert.equal(db.prepare('SELECT popularity FROM products WHERE id = ?').get(product.id).popularity, 1);
    assert.equal(notification.title, 'Order placed');
    assert.equal(emailSent, true);
    assert.equal(sentEmails.length, 1);
    assert.equal(sentEmails[0].personalizations[0].to[0].email, 'cod-test@example.com');

    const notificationsResponse = await request('/api/notifications', { headers: auth });
    const notifications = await notificationsResponse.json();
    assert.equal(notifications.notifications.length, 1);
    assert.equal(notifications.notifications[0].title, 'Order placed');
    const markRead = await request('/api/notifications/read-all', {
      method: 'POST',
      headers: auth,
      body: '{}'
    });
    assert.deepEqual(await markRead.json(), { updated: 1 });
    const readNotifications = await request('/api/notifications', { headers: auth });
    assert.ok((await readNotifications.json()).notifications[0].read_at);

    const cancellation = await request(`/api/orders/${order.id}/cancel`, {
      method: 'POST',
      headers: auth
    });
    assert.equal(cancellation.status, 200);
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, stockBefore);
    assert.equal(db.prepare('SELECT popularity FROM products WHERE id = ?').get(product.id).popularity, 1);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    global.fetch = nativeFetch;
    db.close();
  }
});
