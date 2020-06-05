const { Shopkeeper } = require('../models/shopkeeper');

const registerShopkeeper = async (req, res) => {
  try {
    const shopkeeper = req.body;
    const registered = await Shopkeeper.findOne({ email: shopkeeper.email });
    if (registered !== null) {
      return res.status(404).send({ error: 'Email already registered' });
    }
    shopkeeper.registeredDate = new Date();
    await new Shopkeeper(shopkeeper).save();
    res.status(201).send({});
  } catch (error) {
    res.status(500).end();
  }
};

const loginShopkeeper = async (req, res) => {
  try {
    const { email, password } = req.body;
    const shopkeeper = await Shopkeeper.findByCredentials(email, password);
    const token = await shopkeeper.generateAuthToken();
    res.cookie('shopkeeper', token).send();
  } catch (error) {
    res.status(404).end();
  }
};

module.exports = { registerShopkeeper, loginShopkeeper };
