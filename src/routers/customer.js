const express = require('express');

const customerRouter = new express.Router();

customerRouter.use('/customer', express.static('public/customer'));

module.exports = { customerRouter };
