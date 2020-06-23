const formatDate = (date) => date.format('YYYY-MM-DD');

const renderDate = (date, maxLimit = 7) => {
  const dateToRender = formatDate(moment(date));
  getElement('.date form #date').value = dateToRender;
  getElement('.date form #date').min = formatDate(moment());
  const maxLimitDate = moment().add(maxLimit, 'days');
  getElement('.date form #date').max = formatDate(maxLimitDate);
};

const initInputFields = ({ city = '' } = {}) => {
  getElement('.search form #search').value = city;
  renderDate();
};

const showAddress2 = (address) => {
  return address ? `<span>${address},</span>` : '';
};

const bookingStatus = ({ bookedBy, time }, slots) => {
  let statusInHTML = '';
  for (let index = 0; index < slots; index++) {
    let className = 'available';
    if (slots - bookedBy.length < index) className = 'occupied';
    statusInHTML += `<div class="${className} slots-${slots}"></div>`;
  }
  const timeInHTML = `<span>${moment(time, 'HH:mm').format('hh:mm a')}</span>`;
  return timeInHTML + statusInHTML;
};

const renderBookings = ({ bookings, date }, timing) => {
  const dateToShow = moment(date).format('MMM DD, YYYY');
  let bookingInHTML = `<div class="no-booking occupied">Booking is not available on ${dateToShow}</div>`;
  if (bookings.length) {
    bookingInHTML = bookings.reduce((allBookings, booking) => {
      return `${allBookings}<div class="booking-status"> 
              ${bookingStatus(booking, timing.slots)}</div>`;
    }, '');
  }
  const dateInHTML = `<div class="date"><div>Booking Status:</div><div>${dateToShow}</div></div>`;
  return `${dateInHTML}<div class="all-bookings">${bookingInHTML}</div>`;
};

const shopInHtml = ({ _id, address, bookings, timing }) => {
  return `<div class="shop">
    <div class="shop-title-bar">
      <div class="shop-name">
        <a href="/shop.html?shop=${_id}">${address.shop.name}</a>
      </div>
      <div class="shop-description">${address.shop.description}</div>
    </div>
    <div class="address">
      <span class="heading">Address: </span>
      <span>${address.address1},</span>
      ${showAddress2(address.address2)}
      <span>${address.city},</span>
      <span>${address.district},</span>
      <span>${address.state},</span>
      <span>${address.pinCode}</span>
    </div>
    <div class="bookings" id="${_id}">${renderBookings(bookings, timing)}</div>
  </div>`;
};

const renderShop = (shop) => {
  getElement('.shops').innerHTML = shopInHtml(shop);
};

const renderShops = (shops) => {
  let shopsInHTML = ['<div class="no-shops">No Shops Found...</div>'];
  if (shops.length) {
    shopsInHTML = shops.map((shop) => {
      return shopInHtml(shop);
    });
  }
  getElement('.shops').innerHTML = shopsInHTML.join('');
};
