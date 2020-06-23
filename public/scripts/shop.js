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

const fetchAndRenderShop = async () => {
  try {
    const search = window.location.search;
    const res = await fetch(`/customer/shop${search}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const shop = await res.json();
    renderShop(shop);
    renderDate(shop.bookings.date, shop.timing.bookBefore);
  } catch (error) {
    console.error(error);
  }
};

const listenerOnDate = () => {
  getElement('.date #date').addEventListener('input', () => {
    const date = getElement('#date').value;
    const id = getElement('.bookings').id;
    window.location.href = `/shop.html?shop=${id}&date=${date}`;
  });
};

const main = async () => {
  await loadPartialHTML();
  await fetchAndRenderShop();
  listenerOnDate();
};

window.onload = main;
