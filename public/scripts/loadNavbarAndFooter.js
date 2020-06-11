const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) =>
  Array.from(document.querySelectorAll(selector));
const loadNavbar = async function () {
  try {
    const res = await fetch('./includes/navbar.html');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('.navbar').innerHTML = await res.text();
  } catch (error) {
    console.error(error);
  }
};

const loadFooter = async function () {
  try {
    const res = await fetch('./includes/footer.html');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('.footer').innerHTML = await res.text();
  } catch (error) {
    console.error(error);
  }
};

const renderProfile = async () => {};

const loadPartialHTML = async () => {
  await loadNavbar();
  await loadFooter();
};
