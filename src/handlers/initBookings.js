const moment = require('moment');

const initSlots = ({ openingTime, closingTime, bookingDuration }) => {
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
  const format = (date) => moment(date).format('YYYY-MM-DD');
  const today = format(moment());
  const dateForBooking = format(date);
  const ValidFor = format(moment().add(bookBefore, 'days'));
  return moment(dateForBooking).isBetween(today, ValidFor, undefined, '[]');
};

const initBooking = async (shop, date) => {
  const initBooking = { date };
  initBooking.bookings = initSlots(shop.timing);
  shop.allBookings.unshift(initBooking);
  await shop.save();
  return initBooking;
};

const getBookings = async (shop, dateToFind) => {
  const { allBookings } = shop;
  const date = moment(dateToFind).format('YYYY-MM-DD');
  if (!isValidBooking(shop.timing.bookBefore, date)) {
    return { date: dateToFind, bookings: [] };
  }
  const [booking] = allBookings.filter((booking) => booking.date === date);
  return await (booking || initBooking(shop, date));
};

module.exports = { getBookings };
