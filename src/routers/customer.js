const express = require('express');
const { auth } = require('../middleware/customerAuth');
const { registerCustomer, loginCustomer } = require('../handlers/customer');

const customerRouter = new express.Router();

customerRouter.post('/customer/login', loginCustomer);
customerRouter.post('/customer/register', registerCustomer);

customerRouter.get('/customer/myProfile', auth, (req, res) =>
  res.send(req.customer)
);

module.exports = { customerRouter };
