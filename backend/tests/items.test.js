const request = require('supertest');
const express = require('express');
const itemsRouter = require('../src/routes/items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('Items API', () => {
  test('GET /api/items - should return all items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  test('GET /api/items?q=laptop - should filter items by search query', async () => {
    const response = await request(app).get('/api/items?q=laptop');
    expect(response.status).toBe(200);
    expect(response.body.items.every(item => item.name.toLowerCase().includes('laptop'))).toBe(true);
  });

  test('GET /api/items?limit=2 - should limit results', async () => {
    const response = await request(app).get('/api/items?limit=2');
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeLessThanOrEqual(2);
  });

  test('GET /api/items?page=1&limit=2 - should paginate results', async () => {
    const response = await request(app).get('/api/items?page=1&limit=2');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('limit', 2);
    expect(response.body.items.length).toBeLessThanOrEqual(2);
  });

  test('GET /api/items/:id - should return item by id', async () => {
    const response = await request(app).get('/api/items/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('GET /api/items/:id - should return 404 for non-existent item', async () => {
    const response = await request(app).get('/api/items/999');
    expect(response.status).toBe(404);
  });

  test('POST /api/items - should create new item', async () => {
    const newItem = { name: 'Test Item', category: 'Test', price: 100 };
    const response = await request(app)
      .post('/api/items')
      .send(newItem);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test Item');
    expect(response.body).toHaveProperty('id');
  });
});
