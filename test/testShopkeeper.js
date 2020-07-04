const request = require('supertest');
const sinon = require('sinon');
const { app } = require('../src/router');
const { Shopkeeper } = require('../src/models/shopkeeper');

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
      const { name, email, address, timing } = shopkeeperOne;
      await request(app)
        .get('/shopkeeper/myProfile')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .expect(200)
        .expect({ name, email, address, timing });
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

  describe('Update shopkeeper', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);

    it('Should update the shopkeeper address', async () => {
      await request(app)
        .put('/shopkeeper/updateDetails')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .send({ shopkeeper: { address: { shop: { name: 'Shop Name' } } } })
        .expect(202);
    });

    it('Should should give 501 error', async () => {
      sinon.replace(Shopkeeper, 'findById', () => {
        throw new Error();
      });
      await request(app)
        .put('/shopkeeper/updateDetails')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .send({ shopkeeper: { address: {} } })
        .expect(501);
      sinon.restore();
    });
    it('Should update the shopkeeper timing details', async () => {
      await request(app)
        .put('/shopkeeper/updateDetails')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .send({ shopkeeper: { timing: { openingTime: '9:00', slots: 5 } } })
        .expect(202);
    });

    it('Should should give 501 error', async () => {
      sinon.replace(Shopkeeper, 'findById', () => {
        throw new Error();
      });
      await request(app)
        .put('/shopkeeper/updateDetails')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .send({ shopkeeper: { timing: {} } })
        .expect(501);
      sinon.restore();
    });
  });

  describe('Get Shopkeeper', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);

    it('Should serve the shopkeeper details', async () => {
      await request(app)
        .get('/shopkeeper/shopkeeper')
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .expect(200);
    });
  });
});
