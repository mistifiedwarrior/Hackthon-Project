const getElement = (selector) => document.querySelector(selector);

const showSidebar = () => {
  getElement('.side-navbar').classList.add('show-sidebar');
  getElement('.icon .fa').title = 'close';
};
const closeSidebar = () => {
  getElement('.side-navbar').classList.remove('show-sidebar');
  getElement('.icon .fa').title = 'bar';
};

const toggleSidebar = (element) => {
  const currentIcon = element.firstElementChild.title;
  const actions = { bar: showSidebar, close: closeSidebar };
  actions[currentIcon]();
};

const renderShopkeeperDetails = (shopkeeper) => {
  getElement('.profile .name').innerText = shopkeeper.name;
  getElement('.profile .email').innerText = shopkeeper.email;
};

const loadProfile = () => {
  fetch('/shopkeeper/myProfile')
    .then((res) => res.json())
    .then(renderShopkeeperDetails);
};

const loadSideNavbar = function () {
  fetch('./includes/sideNavbar.html')
    .then((res) => res.text())
    .then((data) => (getElement('#side-navbar').innerHTML = data))
    .then(loadProfile);
};
