const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'development';
process.env.SEED_DEMO_DATA = 'true';

const app = require('../server');
const db = require('../db');

test('only delivered purchases can submit one verified product review', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const request = (url, options = {}) => fetch(`${baseUrl}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const signup = async (email, name) => {
    const response = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: 'SecureReviewPass123' })
    });
    assert.equal(response.status, 201);
    const result = await response.json();
    return { Authorization: `Bearer ${result.token}` };
  };

  try {
    const buyerAuth = await signup('review-buyer@example.com', 'Review Buyer');
    const otherAuth = await signup('other-review-buyer@example.com', 'Other Buyer');
    const product = db.prepare('SELECT id FROM products WHERE active = 1 ORDER BY id LIMIT 1').get();
    const addPurchase = (userId, fulfillmentStatus, paymentMethod = 'cod', paymentStatus = 'not_collected') => {
      const order = db.prepare(`
        INSERT INTO orders (user_id, total, payment_method, payment_status, status)
        VALUES (?, 499, ?, ?, ?)
      `).run(userId, paymentMethod, paymentStatus, fulfillmentStatus === 'delivered' ? 'delivered' : 'shipped');
      return db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity,
          fulfillment_status, delivered_at)
        VALUES (?, ?, 'Review test product', 499, 1, ?, ?)
      `).run(order.lastInsertRowid, product.id, fulfillmentStatus,
      fulfillmentStatus === 'delivered' ? new Date().toISOString() : null).lastInsertRowid;
    };
    const buyerId = db.prepare('SELECT id FROM users WHERE email = ?').get('review-buyer@example.com').id;
    const otherBuyerId = db.prepare('SELECT id FROM users WHERE email = ?').get('other-review-buyer@example.com').id;
    const deliveredItemId = addPurchase(buyerId, 'delivered');
    const inTransitItemId = addPurchase(buyerId, 'shipped');
    const otherBuyerItemId = addPurchase(otherBuyerId, 'delivered');
    const productPath = `/api/products/${product.id}/reviews`;

    const anonymousList = await request(productPath);
    assert.equal(anonymousList.status, 200);
    assert.deepEqual((await anonymousList.json()).summary, { count: 0, average: 0 });

    const eligibilityResponse = await request(`${productPath}/eligibility`, { headers: buyerAuth });
    assert.equal(eligibilityResponse.status, 200);
    assert.deepEqual((await eligibilityResponse.json()).eligible_purchases.map((item) => item.order_item_id), [deliveredItemId]);
    const otherEligibility = await request(`${productPath}/eligibility`, { headers: otherAuth });
    assert.deepEqual((await otherEligibility.json()).eligible_purchases.map((item) => item.order_item_id), [otherBuyerItemId]);

    const forgedPurchase = await request(productPath, {
      method: 'POST',
      headers: otherAuth,
      body: JSON.stringify({
        order_item_id: deliveredItemId,
        rating: 5,
        title: 'Excellent product',
        body: 'This is a very good verified purchase.'
      })
    });
    assert.equal(forgedPurchase.status, 403);

    const undeliveredPurchase = await request(productPath, {
      method: 'POST',
      headers: buyerAuth,
      body: JSON.stringify({
        order_item_id: inTransitItemId,
        rating: 5,
        title: 'Excellent product',
        body: 'This is a very good verified purchase.'
      })
    });
    assert.equal(undeliveredPurchase.status, 403);

    const invalidRating = await request(productPath, {
      method: 'POST',
      headers: buyerAuth,
      body: JSON.stringify({
        order_item_id: deliveredItemId,
        rating: 6,
        title: 'Excellent product',
        body: 'This is a very good verified purchase.'
      })
    });
    assert.equal(invalidRating.status, 400);

    const submitted = await request(productPath, {
      method: 'POST',
      headers: buyerAuth,
      body: JSON.stringify({
        order_item_id: deliveredItemId,
        rating: 5,
        title: 'Excellent product',
        body: 'This is a very good verified purchase.'
      })
    });
    assert.equal(submitted.status, 201);
    assert.equal((await submitted.json()).review.verified_purchase, true);

    const duplicate = await request(productPath, {
      method: 'POST',
      headers: buyerAuth,
      body: JSON.stringify({
        order_item_id: deliveredItemId,
        rating: 4,
        title: 'A second review',
        body: 'This second review must be rejected.'
      })
    });
    assert.equal(duplicate.status, 409);

    const publicReviews = await request(productPath);
    assert.equal(publicReviews.status, 200);
    const reviews = await publicReviews.json();
    assert.deepEqual(reviews.summary, { count: 1, average: 5 });
    assert.equal(reviews.reviews.length, 1);
    assert.equal(reviews.reviews[0].verified_purchase, true);
    assert.equal(db.prepare('SELECT rating, reviews FROM products WHERE id = ?').get(product.id).reviews, 1);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    db.close();
  }
});
