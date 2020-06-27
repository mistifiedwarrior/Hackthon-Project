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
    const { _id, address, allBookings, timing } = shop;
    const [booking] = allBookings.filter((booking) => booking.date === date);
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

const isAlreadyBookedByMe = (bookedBy, customerId) => {
  return bookedBy.find((bookedStatus) => {
    return bookedStatus.customerId.equals(customerId);
  });
};

const findBookings = (allBookings, date) => {
  const result = allBookings.find((booking) => booking.date === date);
  return result.bookings;
};

const updateBooking = function (shop, date, time, customerId) {
  const bookings = findBookings(shop.allBookings, date);
  const { bookedBy } = bookings.find((booking) => booking.time === time);
  if (bookedBy.length === shop.timing.slots) {
    return { error: 'All slots already booked.' };
  }
  if (isAlreadyBookedByMe(bookedBy, customerId)) {
    return { error: 'Already booked this slot.' };
  }
  bookedBy.push({ customerId });
  return { status: true };
};

module.exports = { getOrQuery, filterDetailsToServe, updateBooking };
