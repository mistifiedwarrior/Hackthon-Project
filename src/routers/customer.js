const express = require('express');
const { auth } = require('../middleware/customerAuth');
const {
  registerCustomer,
  loginCustomer,
  serveAllShops,
  serveShop,
  bookSlot,
  cancelSlot,
} = require('../handlers/customer');

const customerRouter = new express.Router();

customerRouter.post('/customer/login', loginCustomer);
customerRouter.post('/customer/register', registerCustomer);

customerRouter.post('/customer/allShops', serveAllShops);
customerRouter.get('/customer/shop', serveShop);
customerRouter.post('/customer/bookSlot', auth, bookSlot);
customerRouter.post('/customer/cancelSlot', auth, cancelSlot);
customerRouter.get('/customer/myProfile', auth, (req, res) =>
  res.send(req.customer)
);

module.exports = { customerRouter };
