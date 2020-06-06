const getElement = (selector) => document.querySelector(selector);

const fixedMenuBar = function ($menu) {
  const action = {
    add: () => $menu.classList.add('fixed-menu-bar'),
    remove: () => $menu.classList.remove('fixed-menu-bar'),
  };
  const doAction =
    document.body.scrollTop > 43 || document.documentElement.scrollTop > 43
      ? action.add
      : action.remove;
  doAction();
};

const scrollFunction = function ($top) {
  let display = 'none';
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    display = 'block';
  }
  $top.style.display = display;
};

const animateScroll = function () {
  const elementScrollTop = document.documentElement.scrollTop;
  let maxScrollTop = Math.max(document.body.scrollTop, elementScrollTop);
  const timer = setInterval(() => {
    document.body.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    document.documentElement.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    if (maxScrollTop < 0) {
      clearInterval(timer);
    }
    maxScrollTop -= 10;
  }, 0.5);
};

const scrollTop = function () {
  fixedMenuBar(getElement('#top-menu'));
  const $top = getElement('.top-arrow');
  scrollFunction($top);
  $top.addEventListener('click', animateScroll);
};

window.onscroll = scrollTop;
