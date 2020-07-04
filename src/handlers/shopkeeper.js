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

const serverMyProfile = async (req, res) => {
  const { email, name, address, timing } = req.shopkeeper;
  res.send({ email, name, address, timing });
};

const updateDetails = async (req, res) => {
  try {
    const { address, timing } = req.body.shopkeeper;
    const shopkeeper = await Shopkeeper.findById(req.shopkeeper._id);
    address && (shopkeeper.address = address);
    timing && (shopkeeper.timing = timing);
    await shopkeeper.save();
    res.status(202).end();
  } catch (error) {
    res.status(501).end();
  }
};

const serveBookedCustomers = async (req, res) => {
  try {
    const date = req.query.date;
    const shop = await req.shopkeeper
      .populate('allBookings.bookings.bookedBy.customer', ['name'])
      .execPopulate();
    const booking = shop.allBookings.find((booking) => booking.date === date);
    if (!booking) {
      throw new Error();
    }
    res.send(booking);
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = {
  registerShopkeeper,
  loginShopkeeper,
  serverMyProfile,
  updateDetails,
  serveBookedCustomers,
};
