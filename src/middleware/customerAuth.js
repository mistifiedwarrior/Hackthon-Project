const jwt = require('jsonwebtoken');
const { Customer } = require('../models/customer');

const auth = async function (req, res, next) {
  try {
    const token = req.cookies.customer;
    const { _id } = jwt.verify(token, process.env.SECRET_CODE);
    const customer = await Customer.findOne({ _id, 'tokens.token': token });
    req.token = token;
    req.customer = customer;
    next();
  } catch (error) {
    res.redirect('./login.html');
  }
};

module.exports = { auth };
