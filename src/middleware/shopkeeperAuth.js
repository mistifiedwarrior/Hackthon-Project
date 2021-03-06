const jwt = require('jsonwebtoken');
const { Shopkeeper } = require('../models/shopkeeper');

const auth = async function (req, res, next) {
  try {
    const token = req.cookies.shopkeeper;
    const { _id } = jwt.verify(token, process.env.SECRET_CODE);
    const shopkeeper = await Shopkeeper.findOne({ _id, 'tokens.token': token });
    req.token = token;
    req.shopkeeper = shopkeeper;
    next();
  } catch (error) {
    const unauthorizedCode = 401;
    res.status(unauthorizedCode).redirect('/shopkeeper/login.html');
  }
};

module.exports = { auth };
