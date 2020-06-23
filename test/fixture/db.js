const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Customer } = require('../../src/models/customer');
const { Shopkeeper } = require('../../src/models/shopkeeper');

const customerOneId = new mongoose.Types.ObjectId();
const customerOne = {
  _id: customerOneId,
  name: 'Customer 1',
  email: 'abc@xyz.com',
  password: 'Shivi@123',
  tokens: [
    { token: jwt.sign({ _id: customerOneId }, process.env.SECRET_CODE) },
  ],
};

const customerTwoId = new mongoose.Types.ObjectId();
const customerTwo = {
  _id: customerTwoId,
  name: 'Anonymous',
  email: 'cba@xyz.com',
  password: '56what!!',
  tokens: [
    { token: jwt.sign({ _id: customerTwoId }, process.env.SECRET_CODE) },
  ],
};

const shopkeeperOneId = new mongoose.Types.ObjectId();
const shopkeeperOne = {
  _id: shopkeeperOneId,
  name: 'shopkeeper1',
  email: 'abc@xyz.com',
  password: 'Shivi@123',
  tokens: [
    { token: jwt.sign({ _id: shopkeeperOneId }, process.env.SECRET_CODE) },
  ],
  address: {
    shop: { name: 'Amazon Book Center', description: 'Amazon Book Store' },
    address1: 'address 1',
    address2: 'address 2',
    state: 'Uttar Pradesh',
    city: 'Ayodhya',
    pinCode: 123456,
    geoCode: {},
  },
  timing: {
    openingTime: '09:00',
    closingTime: '22:00',
    bookingDuration: 30,
    bookBefore: 4,
  },
};

const shopkeeperTwoId = new mongoose.Types.ObjectId();
const shopkeeperTwo = {
  _id: shopkeeperTwoId,
  name: 'Anonymous',
  email: 'cba@xyz.com',
  password: '56what!!',
  tokens: [
    { token: jwt.sign({ _id: shopkeeperTwoId }, process.env.SECRET_CODE) },
  ],
};

const setupDatabase = async function () {
  await new Customer(customerOne).save();
  await new Customer(customerTwo).save();
  await new Shopkeeper(shopkeeperOne).save();
  await new Shopkeeper(shopkeeperTwo).save();
};

const cleanupDatabase = async function () {
  await Customer.deleteMany({});
  await Shopkeeper.deleteMany({});
};

module.exports = {
  customerOneId,
  customerOne,
  customerTwoId,
  customerTwo,
  shopkeeperOneId,
  shopkeeperOne,
  shopkeeperTwoId,
  shopkeeperTwo,
  notExistToken: jwt.sign({}, process.env.SECRET_CODE, { expiresIn: 0 }),
  setupDatabase,
  cleanupDatabase,
};
