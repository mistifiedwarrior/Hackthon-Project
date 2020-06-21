const moment = require('moment');

const initSlots = ({ openingTime, closingTime, bookingDuration } = {}) => {
  const slots = [];
  let startTime = moment(openingTime, 'HH:mm');
  const endTime = moment(closingTime, 'HH:mm');
  while (startTime.isBefore(endTime)) {
    const initSlot = { bookedBy: [] };
    initSlot.time = moment(startTime, 'HH:mm').format('HH:mm');
    slots.push(initSlot);
    startTime = moment(startTime, 'HH:mm').add(bookingDuration, 'minutes');
  }
  return slots;
};

const initBooking = async (shop, date) => {
  const initBooking = { date };
  initBooking.bookings = initSlots(shop.timing);
  shop.allBookings.unshift(initBooking);
  shop.allBookings.sort((booking1, booking2) => booking1.date - booking2.date);
  await shop.save();
  return initBooking;
};

const getBookings = async (shop) => {
  const date = moment(new Date()).format('YYYY-MM-DD');
  const bookings = shop.allBookings.filter((booking) => booking.date === date);
  if (!bookings.length) {
    const booking = await initBooking(shop, date);
    bookings.push(booking);
  }
  return bookings[0];
};

module.exports = { getBookings };
