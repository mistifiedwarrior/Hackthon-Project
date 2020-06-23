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

const filterDetailsToServe = async (shops, date) => {
  const shopsDetails = await Promise.all(
    shops.map(async (shop) => {
      const { _id, address, allBookings, timing } = shop;
      const bookings = allBookings.filter((booking) => booking.date === date);
      if (bookings.length === 0) {
        const booking = await getBookings(shop, date);
        bookings.push(booking);
      }
      return { bookings: bookings[0], _id, address, timing };
    })
  );
  return shopsDetails.filter(
    ({ bookings } = {}) => bookings.bookings && bookings.bookings.length
  );
};

module.exports = { getOrQuery, filterDetailsToServe };
