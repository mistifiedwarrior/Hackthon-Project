const request = require('supertest');
const { app } = require('../src/router');

describe('Customer', () => {
  describe('static page', () => {
    it('should serve the login page', async () => {
      await request(app)
        .get('/customer/login.html')
        .expect(200)
        .expect(/login/);
    });

    it('should serve the register page', async () => {
      await request(app)
        .get('/customer/register.html')
        .expect(200)
        .expect(/Register/);
    });
  });
});
