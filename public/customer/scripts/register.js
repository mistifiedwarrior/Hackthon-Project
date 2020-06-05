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
  getElement('#username').value = '';
  getElement('#name').value = '';
  getElement('#email').value = '';
  getElement('#password').value = '';
  getElement('#cnf-password').value = '';
};

const getFormDetails = function () {
  const name = getElement('#name').value;
  const email = getElement('#email').value;
  const password = getElement('#password').value;
  return { name, email, password };
};

const showMessage = function ({ error }) {
  const $status = getElement('.status');
  let text = error;
  if (!error) {
    text = 'Successfully registered';
    $status.classList.remove('error-status');
    clearInputs();
    const threeSec = 3000;
    setTimeout(() => {
      window.location.href = 'login.html';
    }, threeSec);
  }
  $status.innerText = text;
};

const listenerOnSubmitBtn = function () {
  const $register = getElement('#register-form');
  $register.addEventListener('submit', (event) => {
    event.preventDefault();
    const customerDetails = getFormDetails();
    fetch('/customer/register', getOptions(customerDetails))
      .then((res) => res.json())
      .then((result) => showMessage(result.error));
  });
};

const areInputsNotEmpty = function (formData) {
  const arrayOfInputs = Object.values(formData);
  return arrayOfInputs.every((dataUnit) => dataUnit);
};

const isValidPassword = function ({ password }) {
  const cnfPassword = getElement('#cnf-password').value;
  return password === cnfPassword;
};

const areValidInputs = function () {
  const formData = getFormDetails();
  const areInputNotEmpty = areInputsNotEmpty(formData);
  const areValidPasswords = isValidPassword(formData);
  return areInputNotEmpty && areValidPasswords;
};

const enableBtn = function () {
  getElement('.btn').classList.add('none-pointer');
  if (areValidInputs()) {
    getElement('.btn').classList.remove('none-pointer');
  }
};

const listenerOnConfirmPassword = function () {
  const $cnfPassword = getElement('#cnf-password');
  $cnfPassword.addEventListener('input', () => {
    const formData = getFormDetails();
    const result = isValidPassword(formData) ? '' : 'password is not matched';
    getElement('#cnf-password-checker').innerText = result;
  });
};

const enableSubmitBtn = function () {
  Array.from(getAllElement('input')).forEach((input) => {
    input.addEventListener('input', enableBtn);
  });
};

const main = function () {
  enableSubmitBtn();
  listenerOnSubmitBtn();
  listenerOnConfirmPassword();
};

window.onload = main;
