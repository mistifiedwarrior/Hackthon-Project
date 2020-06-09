const listenerOnSubmit = () => {};

const addListenerOnEditButtons = () => {
  getElement('#address').addEventListener('click', () => {
    console.log('called');
    getElement('.modals').classList.remove('hidden');
    getElement('#address-modal').classList.remove('hidden');
  });
  getElement('#timing').addEventListener('click', () => {
    getElement('.modals').classList.remove('hidden');
    getElement('#timing-modal').classList.remove('hidden');
  });
};

const closeModal = (element) => {
  const modalName = element.parentElement.parentElement;
  modalName.classList.add('hidden');
  modalName.parentElement.classList.add('hidden');
};

const main = async () => {
  await loadSideNavbar();
  addListenerOnEditButtons();
  listenerOnSubmit();
};

window.onload = main;
