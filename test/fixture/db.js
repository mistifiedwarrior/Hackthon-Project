const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Customer } = require('../../src/models/customer');

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

const setupDatabase = async function () {
  await new Customer(customerOne).save();
  await new Customer(customerTwo).save();
};

const cleanupDatabase = async function () {
  await Customer.deleteMany({});
};

module.exports = {
  customerOneId,
  customerOne,
  customerTwoId,
  customerTwo,
  setupDatabase,
  cleanupDatabase,
};
