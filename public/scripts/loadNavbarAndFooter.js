const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) =>
  Array.from(document.querySelectorAll(selector));

const loadNavbar = async function () {
  try {
    const res = await fetch('./includes/navbar.html');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('.navbar').innerHTML = await res.text();
  } catch (error) {
    // console.error(error);
  }
};

const loadFooter = async function () {
  try {
    const res = await fetch('./includes/footer.html');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    getElement('.footer').innerHTML = await res.text();
  } catch (error) {
    // console.error(error);
  }
};

const renderProfile = async () => {
  try {
    const res = await fetch('/customer/myProfile');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const myData = await res.json();
    const $profile = getElement('#profile');
    $profile.innerHTML = `<a href="profile/${myData._id}">${myData.name}</a>`;
    $profile.myId = myData._id;
    return myData;
  } catch (error) {
    // console.error(error);
  }
};

const loadPartialHTML = async () => {
  await loadNavbar();
  await loadFooter();
  return await renderProfile();
};
