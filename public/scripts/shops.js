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

const fetchAndRenderShopOfCurrentLocations = () => {};

const fetchAndRenderShops = async (event) => {
  try {
    event.preventDefault();
    const search = getElement('#search').value;
    const date = getElement('#date').value;
    const shops = await getAllShops({ search, date });
    renderShops(shops);
    listenerOnBookings();
  } catch (error) {
    console.error('No shops found...');
  }
};

const listenerOnSearch = () => {
  getElement('.search form').addEventListener('submit', fetchAndRenderShops);
  getElement('.date #date').addEventListener('input', fetchAndRenderShops);
  const $location = getElement('.search-by-geo-location button');
  $location.addEventListener('click', fetchAndRenderShopOfCurrentLocations);
};

const listenerOnBookings = () => {
  const bookings = getAllElement('.bookings span');
  bookings.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.parentElement.parentElement.parentElement.id;
      const date = getElement('.date #date').value;
      window.location.href = `/shop.html?shop=${id}&date=${date}`;
    });
  });
};

const main = async (event) => {
  const myData = await loadPartialHTML();
  listenerOnSearch();
  initInputFields(myData && myData.address);
  await fetchAndRenderShops(event);
};

window.onload = main;
