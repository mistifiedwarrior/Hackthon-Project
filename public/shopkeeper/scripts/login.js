const getElement = (selector) => document.querySelector(selector);
const getAllElement = (selector) => document.querySelectorAll(selector);

const getOptions = function (body, method = 'POST') {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
};

const clearInputs = function () {
  getElement('#email').value = '';
  getElement('#password').value = '';
};

const getFormDetails = function () {
  const email = getElement('#email').value;
  const password = getElement('#password').value;
  return { email, password };
};

const showMessage = function (status) {
  const $status = getElement('.status');
  const text = 'Credentials not matched';
  if (status) {
    window.location.href = 'dashboard.html';
    return;
  }
  $status.innerText = text;
};

const listenerOnSubmitBtn = function () {
  const $login = getElement('#login-form');
  $login.addEventListener('submit', (event) => {
    event.preventDefault();
    const loginData = getFormDetails();
    fetch('/shopkeeper/login', getOptions(loginData)).then((res) => {
      res.ok && clearInputs();
      showMessage(res.ok);
    });
  });
};

const areInputsNotEmpty = function (formData) {
  const arrayOfInputs = Object.values(formData);
  return arrayOfInputs.every((dataUnit) => dataUnit);
};

const enableBtn = function () {
  getElement('.btn').classList.add('none-pointer');
  const formData = getFormDetails();
  if (areInputsNotEmpty(formData)) {
    getElement('.btn').classList.remove('none-pointer');
  }
};

const enableSubmitBtn = function () {
  Array.from(getAllElement('input')).forEach((input) => {
    input.addEventListener('input', enableBtn);
  });
};

const main = function () {
  enableSubmitBtn();
  listenerOnSubmitBtn();
};

window.onload = main;
