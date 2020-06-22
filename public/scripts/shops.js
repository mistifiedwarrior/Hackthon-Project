const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const getAllShops = async (search) => {
  const res = await fetch('/customer/allShops', getOptions(search));
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
};

const showAddress2 = (address) => {
  return address ? `<span>${address},</span>` : '';
};

const renderBookingsStatus = (bookings) => {
  if (!bookings) return '';
  return 'here are some other bookings';
};

const renderShops = (shops) => {
  const shopsInHTML = shops.map((shop) => {
    return `<div class="shop">
    <div class="shop-title-bar">
      <a class="shop-name" href="/shop.html?shop=${shop._id}">
      ${shop.address.shop.name}</a>
      <div class="shop-description">${shop.address.shop.description}</div>
    </div>
    <div class="address">
      <span class="heading">Address: </span>
      <span>${shop.address.address1},</span>
      ${showAddress2(shop.address.address2)}
      <span>${shop.address.city},</span>
      <span>${shop.address.district},</span>
      <span>${shop.address.state},</span>
      <span>${shop.address.pinCode}</span>
    </div>
    <div class="bookings"><span class="heading">Bookings: <span><br />
      ${renderBookingsStatus(shop.bookings)}
    </div>
  </div>`;
  });
  getElement('.shops').innerHTML = shopsInHTML.join('');
};

const renderDate = () => {
  const date = moment(new Date()).format('YYYY-MM-DD');
  getElement('.date form #date').value = date;
};

const fetchAndRenderShopOfCurrentLocations = () => {};

const fetchAndRenderShops = async (event) => {
  try {
    event.preventDefault();
    const search = getElement('#search').value;
    const date = getElement('#date').value;
    const shops = await getAllShops({ search, date });
    renderShops(shops);
  } catch (error) {
    console.error('No shops found...');
  }
};

const initRenderShops = async (address) => {
  try {
    const date = moment(new Date()).format('YYYY-MM-DD');
    const shops = await getAllShops({ search: address.city, date });
    renderShops(shops);
  } catch (error) {
    console.error(error);
  }
};

const listenerOnSearch = () => {
  getElement('.search form').addEventListener('submit', fetchAndRenderShops);
  const $location = getElement('.search-by-geo-location button');
  $location.addEventListener('click', fetchAndRenderShopOfCurrentLocations);
};

const main = async () => {
  const myData = await loadPartialHTML();
  renderDate();
  listenerOnSearch();
  await initRenderShops(myData.address);
};

window.onload = main;
