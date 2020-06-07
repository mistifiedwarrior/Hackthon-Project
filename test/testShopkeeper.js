const request = require('supertest');
const { app } = require('../src/router');

const {
  shopkeeperOne,
  notExistToken,
  setupDatabase,
  cleanupDatabase,
} = require('./fixture/db');

describe('shopkeeper', () => {
  describe('static page', () => {
    it('should serve the login page', async () => {
      await request(app)
        .get('/shopkeeper/login.html')
        .expect(200)
        .expect(/login/);
    });

    it('should serve the register page', async () => {
      await request(app)
        .get('/shopkeeper/register.html')
        .expect(200)
        .expect(/Register/);
    });
  });

  describe('Register', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);
    it('should register a new shopkeeper', async () => {
      await request(app)
        .post('/shopkeeper/register')
        .send({ name: 'name', email: 'email@email.com', password: 'password' })
        .expect(201);
    });

    it('should give 500 error if required fields not provided', async () => {
      await request(app)
        .post('/shopkeeper/register')
        .send({ email: 'shivi@eam.com', password: 'pass' })
        .expect(500);
    });

    it('should give 404 error if email already registered', async () => {
      await request(app)
        .post('/shopkeeper/register')
        .send({ name: 'name', email: 'abc@xyz.com', password: 'pass' })
        .expect(404)
        .expect({ error: 'Email already registered' });
    });
  });

  describe('Login', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);

    it('should successfully login', async () => {
      await request(app)
        .post('/shopkeeper/login')
        .send({ email: 'abc@xyz.com', password: 'Shivi@123' })
        .expect(200);
    });

    it('should got error if credentials not matched', async () => {
      await request(app)
        .post('/shopkeeper/login')
        .send({ email: 'abc@xyz.com', password: 'Shivi@3' })
        .expect(404);
    });

    it('should got error if email is not reg', async () => {
      await request(app)
        .post('/shopkeeper/login')
        .send({ email: 'notregistered@xyz.com', password: 'Shivi@3' })
        .expect(404);
    });
  });

  describe('Auth and Serve my profile', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);

    it('Should serve my profile', async () => {
      await request(app)
        .get('/shopkeeper/myProfile')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .expect(200)
        .expect({ name: 'shopkeeper1', email: 'abc@xyz.com' });
    });

    it('should not auth if token is not right', async () => {
      await request(app)
        .get('/shopkeeper/myProfile')
        .set('Cookie', 'shopkeeper="randomToken"}')
        .expect(302);
    });

    it('Should not auth if shopkeeper does not exists', async () => {
      await request(app)
        .get('/shopkeeper/myProfile')
        .set('Cookie', `shopkeeper=${notExistToken}`)
        .expect(302);
    });
  });
});
