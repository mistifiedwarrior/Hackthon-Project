const request = require('supertest');
const { app } = require('../src/router');

describe('Customer', () => {
  describe('static page', () => {
    it('should serve the login page', (done) => {
      request(app).get('/customer/login.html').expect(200, done);
    });
  });
});
