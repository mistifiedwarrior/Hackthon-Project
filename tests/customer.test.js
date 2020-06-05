const request = require('supertest');
const { app } = require('../src/router');

const { setupDatabase, cleanupDatabase } = require('./fixture/db');

describe('static page', () => {
  test('should serve the login page', async () => {
    await request(app).get('/customer/login.html').expect(200).expect(/login/);
  });

  test('should serve the register page', async () => {
    await request(app)
      .get('/customer/register.html')
      .expect(200)
      .expect(/Register/);
  });
});

describe('Login and Register', () => {
  beforeEach(setupDatabase);
  afterEach(cleanupDatabase);

  test('should register a new customer', async () => {
    await request(app)
      .post('/customer/register')
      .send({ name: 'name', email: 'email@email.com', password: 'password' })
      .expect(201);
  });

  test('should give 500 error if required fields not provided', async () => {
    await request(app)
      .post('/customer/register')
      .send({ email: 'shivi@eam.com', password: 'pass' })
      .expect(500);
  });

  test('should give 404 error if email already registered', async () => {
    await request(app)
      .post('/customer/register')
      .send({ name: 'name', email: 'shivi@example.com', password: 'pass' })
      .expect(404)
      .expect({ error: 'Email already registered' });
  });

  test('should successfully login', async () => {
    await request(app)
      .post('/customer/login')
      .send({ email: 'shivi@example.com', password: 'Shivi@123' })
      .expect(200);
  });

  test('should got error if credentials not matched', async () => {
    await request(app)
      .post('/customer/login')
      .send({ email: 'shivi@example.com', password: 'Shivi@123' })
      .expect(404);
  });
});
