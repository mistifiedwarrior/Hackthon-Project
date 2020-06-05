const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
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
});

customerSchema.methods.generateAuthToken = async function () {
  const customer = this;
  const { SECRET_CODE } = process.env;
  const options = { _id: customer._id.toString() };
  const token = jwt.sign(options, SECRET_CODE, { expiresIn: '30 days' });
  customer.tokens = customer.tokens.concat({ token });
  await customer.save();
  return token;
};

customerSchema.pre('save', async function (next) {
  const customer = this;
  if (customer.isModified('password')) {
    customer.password = await bcrypt.hash(customer.password, 8);
  }
  next();
});

customerSchema.statics.findByCredentials = async function (email, password) {
  const customer = await Customer.findOne({ email });
  if (!customer) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return customer;
};

customerSchema.virtual('bookings', {
  ref: 'Shopkeeper',
  localField: '_id',
  foreignField: 'customer',
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = { Customer };
