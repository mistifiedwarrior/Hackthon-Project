const express = require('express');
const { registerCustomer, loginCustomer } = require('../handlers/customer');

const customerRouter = new express.Router();

customerRouter.post('/customer/login', loginCustomer);
customerRouter.post('/customer/register', registerCustomer);

module.exports = { customerRouter };
