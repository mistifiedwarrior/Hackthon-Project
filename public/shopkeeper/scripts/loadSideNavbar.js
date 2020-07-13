const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) =>
  Array.from(document.querySelectorAll(selector));

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

const loadProfile = async () => {
  try {
    const res = await fetch('/shopkeeper/myProfile');
    if (!res.ok) throw new Error(res);
    const data = await res.json();
    renderShopkeeperDetails(data);
    return data;
  } catch (error) {
    window.location.href = '/shopkeeper/login.html';
  }
};

const listenersOnLinks = () => {
  getAllElement('.side-navbar a').forEach((element) => {
    element.addEventListener('click', () => {
      getElement('.side-navbar .active').classList.remove('active');
      element.classList.add('active');
    });
  });
};

const loadSideNavbar = async function () {
  try {
    const res = await fetch('./includes/sideNavbar.html');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('#side-navbar').innerHTML = await res.text();
    return await loadProfile();
  } catch (error) {
    console.error(error);
  }
};
