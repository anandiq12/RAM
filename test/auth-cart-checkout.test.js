const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';

const app = require('../server');
const db = require('../db');

test('signup and login hash passwords; authenticated cart and checkout preserve stock rules', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (url, options = {}) => fetch(`${baseUrl}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const password = 'SecureTestPass123';

  try {
    const signupResponse = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'Checkout Buyer', email: 'checkout-buyer@example.com', password })
    });
    assert.equal(signupResponse.status, 201);
    const signup = await signupResponse.json();
    assert.ok(signup.token);
    assert.equal(signup.user.email, 'checkout-buyer@example.com');

    const storedPasswordHash = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(signup.user.id).password_hash;
    assert.notEqual(storedPasswordHash, password);
    assert.match(storedPasswordHash, /^[a-f0-9]{32}:[a-f0-9]{128}$/);

    const rejectedLogin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: signup.user.email, password: 'WrongPassword123' })
    });
    assert.equal(rejectedLogin.status, 401);
    assert.deepEqual(await rejectedLogin.json(), { error: 'Invalid email or password' });

    const loginResponse = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: signup.user.email, password })
    });
    assert.equal(loginResponse.status, 200);
    const login = await loginResponse.json();
    const auth = { Authorization: `Bearer ${login.token}` };

    const emptyCart = await request('/api/cart', { headers: auth });
    assert.deepEqual((await emptyCart.json()).items, []);

    const product = db.prepare('SELECT id, stock FROM products WHERE active = 1 AND stock > 1 ORDER BY id LIMIT 1').get();
    assert.ok(product);
    const addToCart = await request('/api/cart', {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({ items: [{ product_id: product.id, quantity: 1 }] })
    });
    assert.equal(addToCart.status, 200);
    assert.equal((await addToCart.json()).items.length, 1);
    const savedCart = await request('/api/cart', { headers: auth });
    assert.equal((await savedCart.json()).items[0].quantity, 1);

    const invalidCart = await request('/api/cart', {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({ items: [{ product_id: product.id, quantity: product.stock + 1 }] })
    });
    assert.equal(invalidCart.status, 409);
    assert.equal((await (await request('/api/cart', { headers: auth })).json()).items.length, 1);

    const checkout = await request('/api/orders/cod', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        items: [{ product_id: product.id, quantity: 1 }],
        address: { label: 'Home', name: 'Checkout Buyer', mobile: '9876543210', line: '42 Test Road', pincode: '110001' }
      })
    });
    assert.equal(checkout.status, 201);
    const checkoutResult = await checkout.json();
    assert.equal(checkoutResult.order.payment_method, 'cod');
    assert.equal(checkoutResult.order.items.length, 1);
    assert.equal(db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id).stock, product.stock - 1);

    db.exec(`
      CREATE TRIGGER reject_test_account BEFORE INSERT ON users
      WHEN NEW.email = 'internal-error@example.com'
      BEGIN SELECT RAISE(FAIL, 'sensitive database failure'); END
    `);
    const loggedErrors = [];
    const originalConsoleError = console.error;
    console.error = (error) => loggedErrors.push(String(error));
    let internalError;
    try {
      internalError = await request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Internal Error',
          email: 'internal-error@example.com',
          password
        })
      });
    } finally {
      console.error = originalConsoleError;
      db.exec('DROP TRIGGER reject_test_account');
    }
    assert.equal(internalError.status, 500);
    assert.deepEqual(await internalError.json(), { error: 'Internal server error' });
    assert.ok(loggedErrors.some((message) => message.includes('sensitive database failure')));

    const invalidJson = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email":'
    });
    assert.equal(invalidJson.status, 400);
    assert.deepEqual(await invalidJson.json(), { error: 'Invalid JSON request body.' });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});

test('browser auth does not retain or validate plaintext passwords locally', () => {
  const script = fs.readFileSync(path.join(__dirname, '..', 'Script.js'), 'utf8');

  assert.doesNotMatch(script, /localStorage\.setItem\(AUTH_USERS_STORAGE_KEY/);
  assert.doesNotMatch(script, /item\.password\s*===\s*password/);
  assert.match(script, /localStorage\.removeItem\(AUTH_USERS_STORAGE_KEY\)/);
});
