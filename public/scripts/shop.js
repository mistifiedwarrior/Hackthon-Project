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

const renderCancelModal = (time) => {
  getElement('.modals').classList.remove('hidden');
  getElement('.modals #cancel-booked-modal').classList.remove('hidden');
  getElement('#cancel-booked-status').classList.remove('error', 'success');
  getElement('#cancel-booked-status').innerText = '';
  getElement('#cancel-booked-time').innerText = time;
  const date = moment(getElement('#date').value, 'YYYY-MM-DD');
  const $cancelBookedDate = getElement('#cancel-booked-date');
  $cancelBookedDate.innerText = `on ${date.format('MMM DD, YYYY')}.`;
  $cancelBookedDate.date = date;
};

const listenerOnBookingButton = (isLoggedIn) => {
  getAllElement('.booking-status span').forEach((button) => {
    button.addEventListener('click', () => {
      if (!isLoggedIn) return renderLoggedInModal();
      const classes = button.parentElement.firstElementChild.classList;
      if (classes.value.includes('occupied-by-me'))
        return renderCancelModal(button.innerText);
      renderBookSlotModal(button.innerText);
    });
  });
};

const closeModal = (modalName) => {
  modalName.classList.add('hidden');
  modalName.parentElement.classList.add('hidden');
};

const getDetails = (optionOf) => {
  const date = getElement(`#${optionOf}-date`).date._i;
  const timeIn12Hours = getElement(`#${optionOf}-time`).innerText;
  const time = moment(timeIn12Hours, 'hh:mm a').format('HH:mm');
  const shopId = getElement('.bookings').id;
  return { date, time, shopId };
};

const showResponse = function ({ error }, optionOf, response) {
  const $Status = getElement(`#${optionOf}-status`);
  $Status.innerText = error || response;
  $Status.classList.add(error ? 'error' : 'success');
  main();
};

const confirmBooking = async () => {
  try {
    const bookingDetails = getDetails('booking');
    const res = await fetch('/customer/bookSlot', getOptions(bookingDetails));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    showResponse(data, 'booking', 'Successfully booked slot.');
  } catch (error) {
    getElement('#booking-status').innerText = 'Something went wrong!';
    getElement('#booking-status').classList.add('error');
  }
};

const cancelBookedSlot = async () => {
  try {
    const cancelDetails = getDetails('cancel-booked');
    const res = await fetch('/customer/cancelSlot', getOptions(cancelDetails));
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    showResponse(data, 'cancel-booked', 'Successfully canceled your slot.');
  } catch (error) {
    getElement('#cancel-booked-status').innerText = 'Something went wrong!';
    getElement('#cancel-booked-status').classList.add('error');
  }
};

const main = async () => {
  const myData = await loadPartialHTML();
  await fetchAndRenderShop();
  listenerOnDate();
  listenerOnBookingButton(myData);
};

window.onload = main;
