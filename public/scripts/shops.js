const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const getAllShops = async (pinCode) => {
  try {
    const res = await fetch('/customer/allShops', getOptions({ pinCode }));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

const showAddress2 = (address) => {
  return address ? `<span>${address},</span>` : '';
};

const allShopsInHTML = (shops) => {
  const shopsInHTML = shops.map((shop) => {
    return `<div class="shop">
    <div class="shop-title-bar">
      <div class="shop-name">${shop.address.shop.name}</div>
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
    <div class="bookings">Here Should be all types of bookings</div>
  </div>`;
  });
  return shopsInHTML.join('');
};

const renderShops = async ({ address } = {}) => {
  const $allShops = getElement('.shops .all-shops');
  if (!address) {
    const htmlText = `<div>Please search shops by area pin code or by your location given in left side options<br />
    Or your can search shops by login, If you are already logged in, please update your address 
    <a href="/account.html">Update Address</a><br /></div>`;
    $allShops.innerHTML += htmlText;
    return;
  }
  const shops = await getAllShops(address.pinCode);
  let allShops = '<h1 style="text-align:center;">No Shops is in Your area</h1>';
  if (shops.length) {
    allShops = allShopsInHTML(shops);
  }
  $allShops.innerHTML = allShops;
};

const updateFilterInputField = ({ address } = {}) => {
  getElement('.area-pin #pin-code').value = address ? address.pinCode : '';
};

const fetchAndRenderShopByCurrentLocations = () => {};

const fetchAndRenderShops = async (event) => {
  event.preventDefault();
  const pinCode = +getElement('.area-pin #pin-code').value;
  await renderShops({ address: { pinCode } });
  getElement('.area-pin #pin-code').value = '';
};

const listenerOnSearchShops = () => {
  getElement('.area-pin').addEventListener('submit', fetchAndRenderShops);
  const $location = getElement('.location button');
  $location.addEventListener('click', fetchAndRenderShopByCurrentLocations);
};

const main = async () => {
  const myData = await loadPartialHTML();
  updateFilterInputField(myData.address);
  listenerOnSearchShops();
  await renderShops(myData);
};

window.onload = main;
