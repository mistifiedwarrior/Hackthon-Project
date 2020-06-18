/*
shops 
book now
select timing 
confirmation box
show status
cancel booking
my booking as green 
other as red
empty as blue
cancel booking 
book now
 */

const showAddress2 = (address) => {
  return address ? `<span>${address},</span>` : '';
};

const renderBookingsStatus = () => {
  return '';
};

const renderShop = (address) => {
  getElement('.main-content').innerHTML = `<div class="shop">
  <div class="shop-title-bar">
    <div class="shop-name">${address.shop.name}</div>
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
</div>`;
};

const fetchAndRenderShop = async () => {
  try {
    const search = window.location.search;
    const res = await fetch(`/customer/shop${search}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const shop = await res.json();
    renderShop(shop);
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  const myData = await loadPartialHTML();
  await fetchAndRenderShop();
};

window.onload = main;
