const express = require('express');
const {
  registerShopkeeper,
  loginShopkeeper,
} = require('../handlers/shopkeeper');

const shopkeeperRouter = new express.Router();

shopkeeperRouter.post('/shopkeeper/login', loginShopkeeper);
shopkeeperRouter.post('/shopkeeper/register', registerShopkeeper);

module.exports = { shopkeeperRouter };
