const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Customer } = require('../../src/models/customer');
const { Shopkeeper } = require('../../src/models/shopkeeper');

const customerOneId = new mongoose.Types.ObjectId();
const customerOne = {
  _id: customerOneId,
  name: 'Anonymous',
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
