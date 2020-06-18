const { Customer } = require('../models/customer');
const { Shopkeeper } = require('../models/shopkeeper');

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
    const pinCode = req.body.pinCode;
    const shops = await Shopkeeper.find({ 'address.pinCode': pinCode });
    const shopsToServe = shops.map((shop) => ({
      _id: shop._id,
      address: shop.address,
      bookings: shop.bookings,
    }));
    res.send(shopsToServe);
  } catch (error) {
    res.status(500).end();
  }
};

const serveShop = async (req, res) => {
  try {
    const id = req.query.shop;
    const shop = await Shopkeeper.findById(id);
    res.send(shop.address);
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = { registerCustomer, loginCustomer, serveAllShops, serveShop };
