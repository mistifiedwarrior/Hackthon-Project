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
  const booingDuration = +getElement('#timing-modal #duration').value;
  const bookBefore = +getElement('#timing-modal #book-before').value;
  return { openingTime, closingTime, slots, booingDuration, bookBefore };
};

const renderAddress = () => {};
const renderTiming = () => {};

const updateAddress = async (event) => {
  try {
    event.preventDefault();
    const address = getAddress();
    const url = '/shopkeeper/updateAddress';
    const res = await fetch(url, getOptions({ address }, 'PUT'));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    renderAddress(address);
    closeModal(getElement('#address-modal'));
  } catch (error) {
    getElement('.address-status').innerHTML = 'Something went wrong, try again';
  }
};

const updateTiming = async (event) => {
  try {
    event.preventDefault();
    const timing = getTiming();
    const url = '/shopkeeper/updateTiming';
    const res = await fetch(url, getOptions({ timing }, 'PUT'));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    renderTiming(timing);
    closeModal(getElement('#timing-modal'));
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

const main = async () => {
  await loadSideNavbar();
  addListenerOnEditButtons();
  listenerOnSubmit();
};

window.onload = main;
