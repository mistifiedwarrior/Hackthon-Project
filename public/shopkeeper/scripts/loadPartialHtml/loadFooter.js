const loadFooter = function () {
  const getElement = (selector) => document.querySelector(selector);
  fetch('./includes/footer.html')
    .then((res) => res.text())
    .then((data) => {
      getElement('.footer').innerHTML = data;
    });
};
