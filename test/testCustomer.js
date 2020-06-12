const sinon = require('sinon');
const { assert } = require('chai');
const request = require('supertest');
const { app } = require('../src/router');
const { Shopkeeper } = require('../src/models/shopkeeper');

const { customerOne, setupDatabase, cleanupDatabase } = require('./fixture/db');

describe('Customer', () => {
  describe('static page', () => {
    it('should serve the login page', async () => {
      await request(app).get('/login.html').expect(200).expect(/login/);
    });

    it('should serve the register page', async () => {
      await request(app)
        .get('/register.html')
        .expect(200)
        .expect(/Register/);
    });
  });

  describe('Register', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);
    it('should register a new customer', async () => {
      await request(app)
        .post('/customer/register')
        .send({ name: 'name', email: 'email@email.com', password: 'password' })
        .expect(201);
    });

    it('should give 500 error if required fields not provided', async () => {
      await request(app)
        .post('/customer/register')
        .send({ email: 'shivi@eam.com', password: 'pass' })
        .expect(500);
    });

    it('should give 404 error if email already registered', async () => {
      await request(app)
        .post('/customer/register')
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
        .post('/customer/login')
        .send({ email: 'abc@xyz.com', password: 'Shivi@123' })
        .expect(200);
    });

    it('should got error if credentials not matched', async () => {
      await request(app)
        .post('/customer/login')
        .send({ email: 'abc@xyz.com', password: 'Shivi@3' })
        .expect(404);
    });

    it('should got error if email is not reg', async () => {
      await request(app)
        .post('/customer/login')
        .send({ email: 'notregistered@xyz.com', password: 'Shivi@3' })
        .expect(404);
    });
  });

  describe('My profile', () => {
    it('should serve my profile', async () => {
      await request(app)
        .get('/customer/myProfile')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .expect(200);
    });

    it('should give 302 error if unauthorized user', async () => {
      await request(app)
        .get('/customer/myProfile')
        .set('Cookie', 'customer=randomToken')
        .expect(302);
    });
  });

  describe('Serve All Shops', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);
    it('should serve all Shops in my area', async () => {
      const shops = await request(app)
        .post('/customer/allShops')
        .send({ pinCode: 123456 })
        .expect(200);
      assert.strictEqual(shops.body.length, 1);
    });

    it('should serve No Shops if no shop in that area my area', async () => {
      const shops = await request(app)
        .post('/customer/allShops')
        .send({ pinCode: 111111 })
        .expect(200);
      assert.strictEqual(shops.body.length, 0);
    });

    it('should give 500 error if server is crashes', async () => {
      sinon.replace(Shopkeeper, 'find', () => {
        throw new Error();
      });
      await request(app)
        .post('/customer/allShops')
        .send({ pinCode: 111111 })
        .expect(500);
      sinon.restore();
    });
  });
});
