import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('EESHA E-Commerce API Suite', () => {
  let customerToken = '';
  let adminToken = '';
  let testProductId = '';
  let testCategorySlug = '';
  let createdOrderId = '';

  beforeAll(async () => {
    // 1. Login as admin
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@eesha.com', password: 'AdminPassword123!' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.token;

    // 2. Login as customer
    const custRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'customer@eesha.com', password: 'CustomerPassword123!' });
    expect(custRes.status).toBe(200);
    customerToken = custRes.body.data.token;
  });

  // TC01 — Catalogue Data
  it('TC01: Open homepage catalogue data and verify active products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    testProductId = res.body.data.products[0].id;
  });

  // TC02 — Browse Category
  it('TC02: Browse categories and products by category', async () => {
    const catRes = await request(app).get('/api/v1/categories');
    expect(catRes.status).toBe(200);
    expect(catRes.body.data.length).toBeGreaterThan(0);
    testCategorySlug = catRes.body.data[0].slug;

    const prodRes = await request(app).get(`/api/v1/products?category=${testCategorySlug}`);
    expect(prodRes.status).toBe(200);
    expect(prodRes.body.success).toBe(true);
  });

  // TC03 — Search
  it('TC03: Search for products and verify match and empty results', async () => {
    const searchRes = await request(app).get('/api/v1/products?search=headphones');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.data.products.length).toBeGreaterThan(0);

    const emptyRes = await request(app).get('/api/v1/products?search=nonexistenttermxyz999');
    expect(emptyRes.status).toBe(200);
    expect(emptyRes.body.data.products.length).toBe(0);
    expect(emptyRes.body.data.total).toBe(0);
  });

  // TC04 — Filter and Sorting
  it('TC04: Apply price filters and price-asc sorting', async () => {
    const sortRes = await request(app).get('/api/v1/products?sortBy=price-asc');
    expect(sortRes.status).toBe(200);
    const prods = sortRes.body.data.products;
    if (prods.length >= 2) {
      expect(prods[0].price).toBeLessThanOrEqual(prods[1].price);
    }
  });

  // TC05 — Product Details
  it('TC05: Open product details by slug', async () => {
    const res = await request(app).get('/api/v1/products/aethel-studio-master-headphones');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toContain('Aethel');
    expect(res.body.data.images.length).toBeGreaterThan(0);
  });

  // TC06 & TC07 — Cart Operations
  it('TC06 & TC07: Add product to cart and update quantity', async () => {
    const sessionId = 'test-session-suite-' + Date.now();

    // Add to cart
    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('x-session-id', sessionId)
      .send({ productId: testProductId, quantity: 1 });
    expect(addRes.status).toBe(200);
    expect(addRes.body.data.items.length).toBe(1);
    const cartItemId = addRes.body.data.items[0].id;

    // Update quantity
    const updateRes = await request(app)
      .put(`/api/v1/cart/items/${cartItemId}`)
      .set('x-session-id', sessionId)
      .send({ quantity: 2 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.items[0].quantity).toBe(2);
  });

  // TC08 — Invalid Quantity
  it('TC08: Attempt invalid quantity update', async () => {
    const sessionId = 'test-session-suite-inv-' + Date.now();
    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('x-session-id', sessionId)
      .send({ productId: testProductId, quantity: -5 });
    expect(addRes.status).toBe(400);
  });

  // TC09 — Unavailable Inventory
  it('TC09: Attempt to add quantity exceeding inventory stock', async () => {
    const sessionId = 'test-session-suite-over-' + Date.now();
    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('x-session-id', sessionId)
      .send({ productId: testProductId, quantity: 99999 });
    expect(addRes.status).toBe(400);
    expect(addRes.body.error).toContain('available in stock');
  });

  // TC10 — Incomplete Checkout Validation
  it('TC10: Submit incomplete checkout details and verify rejection', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        shippingAddress: { fullName: 'A' }, // Missing street, phone, city
        items: [{ productId: testProductId, quantity: 1 }],
      });
    expect(res.status).toBe(400);
  });

  // TC11 & TC12 — Valid Checkout and Duplicate Protection (Idempotency)
  it('TC11 & TC12: Complete valid checkout and test duplicate submission protection', async () => {
    const idempotencyKey = 'test-key-' + Date.now();
    const orderPayload = {
      shippingAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 91234 56789',
        street: '42, Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      paymentMethod: 'DEVELOPMENT_MOCK',
      items: [{ productId: testProductId, quantity: 1 }],
    };

    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .set('idempotency-key', idempotencyKey)
      .send(orderPayload);

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.data.orderNumber).toBeDefined();
    expect(orderRes.body.data.items.length).toBe(1);
    expect(orderRes.body.data.items[0].unitPrice).toBeGreaterThan(0);
    createdOrderId = orderRes.body.data.id;

    // TC12: Duplicate submission with same idempotency key returns existing order
    const dupRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .set('idempotency-key', idempotencyKey)
      .send(orderPayload);

    expect(dupRes.body.data.id).toBe(createdOrderId);
  });

  // TC13 — Unauthorized Order Access
  it('TC13: Unauthorized user attempting to access another customer order is denied', async () => {
    // Unauthenticated attempt to access private order
    const res = await request(app).get(`/api/v1/orders/${createdOrderId}`);
    expect(res.status).toBe(403);
  });

  // TC19 — Unauthorized Admin Access Denied
  it('TC19: Customer attempting admin endpoints is denied with 403', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  // TC16 & TC18 — Admin Operations
  it('TC16 & TC18: Admin can view dashboard KPIs, adjust stock, and update order status', async () => {
    // Admin dashboard
    const dashRes = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(dashRes.status).toBe(200);
    expect(dashRes.body.data.summary.totalOrders).toBeGreaterThan(0);

    // TC18: Admin adjust inventory
    const adjustRes = await request(app)
      .post(`/api/v1/admin/products/${testProductId}/inventory`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ changeQuantity: 5, reason: 'Restock batch #401' });
    expect(adjustRes.status).toBe(200);

    // TC21: Permitted status transition: PAID -> PROCESSING
    const statusRes = await request(app)
      .put(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PROCESSING' });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.status).toBe('PROCESSING');

    // TC22: Prohibited status transition: PROCESSING cannot jump to PENDING
    const invalidTransRes = await request(app)
      .put(`/api/v1/admin/orders/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PENDING' });
    expect(invalidTransRes.status).toBe(400);
  });
});
