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
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  await loadPartialHTML();
  await fetchAndRenderShop();
};

window.onload = main;
