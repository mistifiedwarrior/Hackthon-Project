const express = require('express');
const { registerCustomer, loginCustomer } = require('../handlers/customer');

const customerRouter = new express.Router();

customerRouter.use('/customer', express.static('public/customer'));
customerRouter.post('/customer/register', registerCustomer);
customerRouter.post('/customer/login', loginCustomer);

module.exports = { customerRouter };
