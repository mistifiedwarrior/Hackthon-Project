const renderInputFields = (search, date) => {
  getElement('.date form #date').value = date;
  getElement('.date form #date').min = date;
  const maxLimit = moment(new Date()).add(7, 'days').format('YYYY-MM-DD');
  getElement('.date form #date').max = maxLimit;
  getElement('.search form #search').value = search;
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

const renderBookings = (bookings, timing) => {
  const bookingInHTML = bookings.bookings.map((booking) => {
    return `<div class="booking-status"> 
    ${bookingStatus(booking, timing.slots)}</div>`;
  });
  const dateInHTML = `<div class="date">
    <div>Booking Status: </div>
    <div>${moment(bookings.date).format('MMM DD, YYYY')}</div>
  </div>`;
  return `${dateInHTML}<div class="all-bookings">
  ${bookingInHTML.join('')}</div>`;
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
    <div class="bookings" title="${_id}">
      ${renderBookings(bookings, timing)}</div>
  </div>`;
};

const renderShop = (shop) => {
  getElement('.main-content').innerHTML = shopInHtml(shop);
};

const renderShops = (shops) => {
  const shopsInHTML = shops.map((shop) => {
    return shopInHtml(shop);
  });
  getElement('.shops').innerHTML = shopsInHTML.join('');
};
