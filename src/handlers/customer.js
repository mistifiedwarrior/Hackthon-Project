const { Customer } = require('../models/customer');

const registerCustomer = async (req, res) => {
  try {
    const customer = req.body;
    const registered = await Customer.findOne({ email: customer.email });
    if (registered !== null) {
      res.status(404).send({ error: 'Email already registered' });
    }
    customer.registeredDate = new Date();
    await new Customer(customer).save();
    res.status(201).end();
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

module.exports = { registerCustomer, loginCustomer };
