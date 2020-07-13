const request = require('supertest');
const moment = require('moment');
const sinon = require('sinon');
const { app } = require('../src/router');
const { Shopkeeper } = require('../src/models/shopkeeper');

const {
  customerOne,
  customerTwo,
  shopkeeperOneId,
  shopkeeperOne,
  setupDatabase,
  cleanupDatabase,
} = require('./fixture/db');

describe('shopkeeper bookings', () => {
  describe('all bookings', () => {
    beforeEach(setupDatabase);
    afterEach(cleanupDatabase);
    it('should serve all customer whoever booked slot', async () => {
      const date = moment().format('YYYY-MM-DD');
      await request(app)
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' });
      await request(app)
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerTwo.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' });

      await request(app)
        .get(`/shopkeeper/bookedCustomers?date=${date}`)
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .expect(200);
    });

    it('should give error if no booking initialize', async () => {
      const date = moment().add(7, 'days').format('YYYY-MM-DD');
      await request(app)
        .get(`/shopkeeper/bookedCustomers?date=${date}`)
        .set('Cookie', `shopkeeper=${shopkeeperOne.tokens[0].token}`)
        .expect(500);
    });
  });
});
