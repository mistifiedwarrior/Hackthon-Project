const { getBookings } = require('./initBookings');

const getOrQuery = ($regex) => {
  return {
    $or: [
      { 'address.shop.name': { $regex, $options: 'i' } },
      { 'address.shop.description': { $regex, $options: 'i' } },
      { 'address.address1': { $regex, $options: 'i' } },
      { 'address.address2': { $regex, $options: 'i' } },
      { 'address.city': { $regex, $options: 'i' } },
      { 'address.district': { $regex, $options: 'i' } },
      { 'address.state': { $regex, $options: 'i' } },
    ],
  };
};

const filterDetails = (date) => {
  return async (shop) => {
    const { allBookings, _id, address, timing } = shop;
    const booking = allBookings.find((booking) => booking.date === date);
    const bookings = await (booking || getBookings(shop, date));
    return { bookings, _id, address, timing };
  };
};

const filterDetailsToServe = async (shops, date) => {
  const shopsDetails = await Promise.all(shops.map(filterDetails(date)));
  return shopsDetails.filter(({ bookings }) => {
    return bookings.bookings && bookings.bookings.length;
  });
};

const isAlreadyBookedByMe = (bookedBy, customer) => {
  return bookedBy.find((bookedStatus) => {
    return bookedStatus.customer.equals(customer);
  });
};

const findBookings = (allBookings, date) => {
  const result = allBookings.find((booking) => booking.date === date);
  return result.bookings;
};

const updateBooking = function (shop, date, time, customer) {
  const bookings = findBookings(shop.allBookings, date);
  const { bookedBy } = bookings.find((booking) => booking.time === time);
  if (bookedBy.length === shop.timing.slots) {
    return { error: 'All slots already booked.' };
  }
  if (isAlreadyBookedByMe(bookedBy, customer)) {
    return { error: 'Already booked this slot.' };
  }
  bookedBy.push({ customer });
  return { status: true };
};

const removeMyBooking = function (bookedBy, customer) {
  for (let time = 0; time < bookedBy.length; time++) {
    const bookedStatus = bookedBy.shift();
    if (bookedStatus.customer.equals(customer)) {
      return;
    }
    bookedBy.push(bookedStatus);
  }
};

const cancelBooking = function (shop, date, time, customer) {
  const bookings = findBookings(shop.allBookings, date);
  const { bookedBy } = bookings.find((booking) => booking.time === time);
  if (!isAlreadyBookedByMe(bookedBy, customer)) {
    throw new Error();
  }
  removeMyBooking(bookedBy, customer);
};

module.exports = {
  getOrQuery,
  filterDetailsToServe,
  updateBooking,
  cancelBooking,
};
