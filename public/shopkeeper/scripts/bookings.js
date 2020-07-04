const renderShopNameAndDate = ({ address, timing }) => {
  getElement('.shop-name').innerText = address.shop.name;
  getElement('.shop-name').slots = timing.slots;
  getElement('#date').value = moment().format('YYYY-MM-DD');
};

const getCustomerName = ({ customer } = {}) => {
  return customer ? customer.name : '';
};

const bookingStatus = ({ bookedBy, time }) => {
  const slots = getElement('.shop-name').slots;
  const customers = [];
  let statusInHTML = '';
  for (let index = 0; index < slots; index++) {
    customers.push(getCustomerName(bookedBy[index]));
    const className = index >= bookedBy.length ? 'available' : 'occupied';
    statusInHTML += `<div class="${className} slots-${slots}"></div>`;
  }
  const timeToShow = moment(time, 'HH:mm').format('hh:mm a');
  const customersInString = customers.join('__::__');
  return `${statusInHTML}<span customers="${customersInString}">${timeToShow}</span>`;
};

const parseBookingsInHTML = (bookings) => {
  const allBookings = bookings.map((booking) => {
    return `<div class="booking-status">${bookingStatus(booking)}</div>`;
  });
  return allBookings.join('');
};

const getAllCustomers = (node) => {
  const customers = node.attributes.customers.value.split('__::__');
  return customers.filter((customer) => customer);
};

const setModal = (event, modal) => {
  modal.classList.remove('hidden');
};

const renderCustomers = (event, customers) => {
  const slots = getElement('.shop-name').slots;
  let customerSlots = '';
  for (let slot = 1; slot <= slots; slot++) {
    customerSlots += `<div class="customer">
    <div class="slot">${slot}</div>
    <div class="name">${customers[slot - 1] || '-'}</div>
    </div>`;
  }
  const header = `<div>${event.target.textContent}</div>`;
  const modal = getElement('#customers-modal');
  modal.innerHTML = `<div class="modal-header">${header}</div><div class="customers">${customerSlots}</div>`;
  setModal(event, modal);
};

const listenerOnCustomer = () => {
  getAllElement('.booking-status span').forEach((bookingStatus) => {
    bookingStatus.addEventListener('click', (event) => {
      const customers = getAllCustomers(event.target);
      renderCustomers(event, customers);
    });
  });
};

const fetchAndRenderBookings = async (date = moment().format('YYYY-MM-DD')) => {
  try {
    const res = await fetch(`/shopkeeper/bookedCustomers?date=${date}`);
    if (!res.ok) throw new Error();
    const bookings = await res.json();
    getElement('.bookings').innerHTML = parseBookingsInHTML(bookings.bookings);
    listenerOnCustomer();
  } catch (error) {
    const $bookings = getElement('.bookings');
    const dateToShow = moment(date).format('MMM DD, YYYY');
    $bookings.innerHTML = `<div class="no-bookings">Bookings is not Available on ${dateToShow}</div>`;
  }
};

const listenerOnDate = () => {
  getElement('#date').addEventListener('input', (event) => {
    fetchAndRenderBookings(event.target.value);
  });
};

const main = async () => {
  const shop = await loadSideNavbar();
  renderShopNameAndDate(shop);
  await fetchAndRenderBookings();
  listenerOnDate();
};

window.onload = main;
