const express = require('express');

const { auth } = require('../middleware/shopkeeperAuth');
const {
  registerShopkeeper,
  loginShopkeeper,
  serverMyProfile,
  updateDetails,
  serveBookedCustomers,
} = require('../handlers/shopkeeper');

const shopkeeperRouter = new express.Router();

shopkeeperRouter.post('/shopkeeper/login', loginShopkeeper);
shopkeeperRouter.post('/shopkeeper/register', registerShopkeeper);
shopkeeperRouter.get('/shopkeeper/myProfile', auth, serverMyProfile);
shopkeeperRouter.put('/shopkeeper/updateDetails', auth, updateDetails);
shopkeeperRouter.get('/shopkeeper/bookedCustomers', auth, serveBookedCustomers);

shopkeeperRouter.get('/shopkeeper/shopkeeper', auth, (req, res) =>
  res.send(req.shopkeeper)
);

module.exports = { shopkeeperRouter };
