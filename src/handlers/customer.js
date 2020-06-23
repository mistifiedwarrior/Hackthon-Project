const { Customer } = require('../models/customer');
const { Shopkeeper } = require('../models/shopkeeper');
const { getBookings } = require('./initBookings');
const { getOrQuery, filterDetailsToServe } = require('./utilCustomer');

const registerCustomer = async (req, res) => {
  try {
    const customer = req.body;
    const registered = await Customer.findOne({ email: customer.email });
    if (registered !== null) {
      return res.status(404).send({ error: 'Email already registered' });
    }
    customer.registeredDate = new Date();
    await new Customer(customer).save();
    res.status(201).send({});
  } catch (error) {
    res.status(500).end();
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findByCredentials(email, password);
    const token = await customer.generateAuthToken();
    res.cookie('customer', token).send();
  } catch (error) {
    res.status(404).end();
  }
};

const serveAllShops = async (req, res) => {
  try {
    const { search, date } = req.body;
    const query = getOrQuery(search);
    const shops = await Shopkeeper.find(query);
    const shopsToServe = await filterDetailsToServe(shops, date);
    res.send(shopsToServe);
  } catch (error) {
    res.status(500).end();
  }
};

const serveShop = async (req, res) => {
  try {
    const { shop: id, date } = req.query;
    const shop = await Shopkeeper.findById(id);
    const bookings = await getBookings(shop, date);
    const { _id, address, timing } = shop;
    res.send({ _id, address, timing, bookings });
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = { registerCustomer, loginCustomer, serveAllShops, serveShop };
