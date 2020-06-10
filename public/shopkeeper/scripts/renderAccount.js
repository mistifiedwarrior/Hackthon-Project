const renderAddressOnPage = (address) => {
  getElement('#shop-name').innerText = address.shop.name;
  getElement('#shop-description').innerText = address.shop.description;
  getElement('#address-1').innerText = address.address1;
  getElement('#address-2').innerText = address.address2;
  getElement('#city').innerText = address.city;
  getElement('#district').innerText = address.district;
  getElement('#state').innerText = address.state;
  getElement('#pin-code').innerText = address.pinCode;
};

const renderAddressOnModal = (address) => {
  const shop = address.shop || {};
  getElement('#address-modal #shop-name').value = shop.name;
  getElement('#address-modal #shop-description').value = shop.description;
  getElement('#address-modal #address-1').value = address.address1;
  getElement('#address-modal #address-2').value = address.address2;
  getElement('#address-modal #city').value = address.city;
  getElement('#address-modal #district').value = address.district;
  getElement('#address-modal #state').value = address.state;
  getElement('#address-modal #pin-code').value = address.pinCode;
};

const renderTimingOnPage = (timing) => {
  getElement('#opening-time').innerText = timing.openingTime;
  getElement('#closing-time').innerText = timing.closingTime;
  getElement('#total-slots').innerText = timing.slots;
  getElement('#booking-duration').innerText = timing.bookingDuration;
  getElement('#booking-before').innerText = timing.bookBefore;
};

const renderTimingOnModal = (timing) => {
  getElement('#timing-modal #opening-time').value = timing.openingTime;
  getElement('#timing-modal #closing-time').value = timing.closingTime;
  getElement('#timing-modal #slots').value = timing.slots;
  getElement('#timing-modal #duration').value = timing.bookingDuration;
  getElement('#timing-modal #book-before').value = timing.bookBefore;
};

const renderAddress = (address = {}) => {
  renderAddressOnPage(address);
  renderAddressOnModal(address);
};

const renderTiming = (timing = {}) => {
  renderTimingOnPage(timing);
  renderTimingOnModal(timing);
};
