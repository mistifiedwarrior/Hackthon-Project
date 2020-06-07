const express = require('express');

const { auth } = require('../middleware/shopkeeperAuth');
const {
  registerShopkeeper,
  loginShopkeeper,
  serverMyProfile,
} = require('../handlers/shopkeeper');

const shopkeeperRouter = new express.Router();

shopkeeperRouter.post('/shopkeeper/login', loginShopkeeper);
shopkeeperRouter.post('/shopkeeper/register', registerShopkeeper);
shopkeeperRouter.get('/shopkeeper/myProfile', auth, serverMyProfile);
module.exports = { shopkeeperRouter };
