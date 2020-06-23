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

const isValidBooking = (bookBefore, date) => {
  const dateForBooking = moment(date);
  const ValidFor = moment(new Date()).add(bookBefore, 'days');
  return moment(dateForBooking).isBetween(moment(), ValidFor);
};

const initBooking = async (shop, date) => {
  const initBooking = { date };
  initBooking.bookings = initSlots(shop.timing);
  shop.allBookings.unshift(initBooking);
  await shop.save();
  return initBooking;
};

const getBookings = async (shop, date) => {
  const { allBookings } = shop;
  const dateToFind = moment(date).format('YYYY-MM-DD');
  if (!isValidBooking(shop.timing.bookBefore, date)) {
    return { date: dateToFind, bookings: [] };
  }
  const bookings = allBookings.filter((booking) => booking.date === dateToFind);
  if (!bookings.length) {
    const booking = await initBooking(shop, dateToFind);
    bookings.push(booking);
  }
  return bookings[0];
};

module.exports = { getBookings };
