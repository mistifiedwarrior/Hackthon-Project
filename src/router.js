const express = require('express');
const cookieParser = require('cookie-parser');
require('./db/connectDB');

const { customerRouter } = require('./routers/customer');
const { shopkeeperRouter } = require('./routers/shopkeeper');

const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(customerRouter);
app.use(shopkeeperRouter);

module.exports = { app };
