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
  } catch (error) {
    console.error('No shops found...');
  }
};

const initRenderShops = async (address = {}) => {
  try {
    const date = moment(new Date()).format('YYYY-MM-DD');
    const shops = await getAllShops({ search: address.city || '', date });
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
  await initRenderShops(myData && myData.address);
};

window.onload = main;
