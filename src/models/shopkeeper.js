const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const shopkeeperSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  registeredDate: { type: Number },
  address: {
    state: { type: String },
    district: { type: String },
    city: { type: String },
    landmark: { type: String },
    pin: { type: Number },
    geoCode: { latitude: { type: Number }, longitude: { type: Number } },
  },
  tokens: [{ token: { type: String } }],
  shop: {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  openingTime: { type: String },
  closingTime: { type: String },
  totalSlots: { type: Number },
  bookingDuration: { type: Number },
  bookBefore: { type: String },
});

shopkeeperSchema.methods.generateAuthToken = async function () {
  const shopkeeper = this;
  const { SECRET_CODE } = process.env;
  const options = { _id: shopkeeper._id.toString() };
  const token = jwt.sign(options, SECRET_CODE, { expiresIn: '30 days' });
  shopkeeper.tokens = shopkeeper.tokens.concat({ token });
  await shopkeeper.save();
  return token;
};

shopkeeperSchema.pre('save', async function (next) {
  const shopkeeper = this;
  if (shopkeeper.isModified('password')) {
    const hashTime = 8;
    shopkeeper.password = await bcrypt.hash(shopkeeper.password, hashTime);
  }
  next();
});

shopkeeperSchema.statics.findByCredentials = async function (email, password) {
  const shopkeeper = await Shopkeeper.findOne({ email });
  if (!shopkeeper) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, shopkeeper.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return shopkeeper;
};

shopkeeperSchema.virtual('bookings', {
  ref: 'Shopkeeper',
  localField: '_id',
  foreignField: 'shopkeeper',
});

const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);
module.exports = { Shopkeeper };
