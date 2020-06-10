const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const getAddress = () => {
  const name = getElement('#address-modal #shop-name').value;
  const description = getElement('#address-modal #shop-description').value;
  const address1 = getElement('#address-modal #address-1').value;
  const address2 = getElement('#address-modal #address-2').value;
  const city = getElement('#address-modal #city').value;
  const district = getElement('#address-modal #district').value;
  const state = getElement('#address-modal #state').value;
  const pinCode = +getElement('#address-modal #pin-code').value;
  const shop = { name, description };
  return { shop, address1, address2, city, district, state, pinCode };
};

const getTiming = () => {
  const openingTime = getElement('#timing-modal #opening-time').value;
  const closingTime = getElement('#timing-modal #closing-time').value;
  const slots = +getElement('#timing-modal #slots').value;
  const bookingDuration = +getElement('#timing-modal #duration').value;
  const bookBefore = +getElement('#timing-modal #book-before').value;
  return { openingTime, closingTime, slots, bookingDuration, bookBefore };
};

const updateAddress = async (event) => {
  try {
    event.preventDefault();
    const shopkeeper = { address: getAddress() };
    const url = '/shopkeeper/updateDetails';
    const res = await fetch(url, getOptions({ shopkeeper }, 'PUT'));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    closeModal(getElement('#address-modal'));
    renderAddress(address);
  } catch (error) {
    getElement('.address-status').innerHTML = 'Something went wrong, try again';
  }
};

const updateTiming = async (event) => {
  try {
    event.preventDefault();
    const shopkeeper = { timing: getTiming() };
    console.log(shopkeeper);
    const url = '/shopkeeper/updateDetails';
    const res = await fetch(url, getOptions({ shopkeeper }, 'PUT'));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    closeModal(getElement('#timing-modal'));
    renderTiming(timing);
  } catch (error) {
    getElement('.timing-status').innerHTML = 'Something went wrong, try again';
  }
};

const listenerOnSubmit = () => {
  getElement('#address-modal form').addEventListener('submit', updateAddress);
  getElement('#timing-modal form').addEventListener('submit', updateTiming);
};

const addListenerOnEditButtons = () => {
  getElement('#address').addEventListener('click', () => {
    getElement('.modals').classList.remove('hidden');
    getElement('#address-modal').classList.remove('hidden');
  });
  getElement('#timing').addEventListener('click', () => {
    getElement('.modals').classList.remove('hidden');
    getElement('#timing-modal').classList.remove('hidden');
  });
};

const closeModal = (modalName) => {
  modalName.classList.add('hidden');
  modalName.parentElement.classList.add('hidden');
};

const loadShopkeeper = async () => {
  try {
    const res = await fetch('/shopkeeper/shopkeeper');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const shopkeeper = await res.json();
    renderAddress(shopkeeper.address);
    renderTiming(shopkeeper.timing);
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  await loadSideNavbar();
  addListenerOnEditButtons();
  await loadShopkeeper();
  listenerOnSubmit();
};

window.onload = main;
