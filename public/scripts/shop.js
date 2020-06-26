const getOptions = (body, method = 'POST') => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

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

const renderLoggedInModal = () => {
  getElement('.modals').classList.remove('hidden');
  getElement('.modals #login-modal').classList.remove('hidden');
};

const renderBookSlotModal = (time) => {
  getElement('.modals').classList.remove('hidden');
  getElement('.modals #booking-modal').classList.remove('hidden');
  getElement('#booking-status').classList.remove('error', 'success');
  getElement('#booking-status').innerText = '';
  getElement('#booking-time').innerText = time;
  const date = moment(getElement('#date').value, 'YYYY-MM-DD');
  getElement('#booking-date').innerText = `on ${date.format('MMM DD, YYYY')}.`;
  getElement('#booking-date').date = date;
};

const listenerOnBookingButton = (isLoggedIn) => {
  getAllElement('.booking-status span').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isLoggedIn) return renderLoggedInModal();
      renderBookSlotModal(button.innerText);
    });
  });
};

const closeModal = (modalName) => {
  modalName.classList.add('hidden');
  modalName.parentElement.classList.add('hidden');
};

const getBookingDetails = () => {
  const date = getElement('#booking-date').date._i;
  const timeIn12Hours = getElement('#booking-time').innerText;
  const time = moment(timeIn12Hours, 'hh:mm a').format('HH:mm');
  const shopId = getElement('.bookings').id;
  return { date, time, shopId };
};

const confirmBooking = async () => {
  try {
    const bookingDetails = getBookingDetails();
    const res = await fetch('/customer/bookSlot', getOptions(bookingDetails));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('#booking-status').innerText = 'Successfully booked Slot';
    getElement('#booking-status').classList.add('success');
    setTimeout(main, 1000);
  } catch (error) {
    getElement('#booking-status').innerText = 'Something went wrong!';
    getElement('#booking-status').classList.add('error');
  }
};

const main = async () => {
  const myData = await loadPartialHTML();
  await fetchAndRenderShop();
  listenerOnDate();
  listenerOnBookingButton(myData);
};

window.onload = main;
