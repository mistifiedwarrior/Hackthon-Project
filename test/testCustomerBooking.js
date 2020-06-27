const sinon = require('sinon');
const moment = require('moment');
const request = require('supertest');
const { app } = require('../src/router');
const { Shopkeeper } = require('../src/models/shopkeeper');

const {
  customerOne,
  customerTwo,
  shopkeeperOneId,
  setupDatabase,
  initBookings,
  cleanupDatabase,
} = require('./fixture/db');

describe('Customer Booking', () => {
  describe('Book Slot', () => {
    beforeEach(async () => {
      await setupDatabase();
      await initBookings();
    });
    afterEach(cleanupDatabase);

    it('should book my slot', async () => {
      const date = moment().format('YYYY-MM-DD');
      await request(app)
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' })
        .expect(200)
        .expect({ status: true });
    });

    it('should give error if i already booked that slot', async () => {
      const date = moment().format('YYYY-MM-DD');
      await request(app)
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' })
        .expect(200);

      await request(app)
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' })
        .expect(200)
        .expect({ error: 'Already booked this slot.' });
    });

    it('should give error if all slots already booked', async () => {
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
        .post('/customer/bookSlot')
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .send({ shopId: shopkeeperOneId, date, time: '09:00' })
        .expect(200)
        .expect({ error: 'All slots already booked.' });
    });

    it('should give 500 error if server is crashes', async () => {
      sinon.replace(Shopkeeper, 'findById', () => {
        throw new Error();
      });
      await request(app)
        .post('/customer/bookSlot')
        .send({ shopId: '123' })
        .set('Cookie', `customer=${customerOne.tokens[0].token}`)
        .expect(500);
      sinon.restore();
    });
  });
});
