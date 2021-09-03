'use strict';

// Hidden / unhidden search icon
const search = document.querySelectorAll('.menu__item--search');

search.forEach((s) => {
  s.addEventListener('click', (e) => {
    e.currentTarget.classList.add('active');
    console.log(e.currentTarget);
  });
});

document.addEventListener('click', (e) => {
  search.forEach((s) => {
    if (e.target.closest('.menu__item--search')) return;
    s.classList.remove('active');
  });
});

document.addEventListener('keydown', (e) => {
  search.forEach((s) => {
    if (e.key === 'Escape') s.classList.remove('active');
  });
});

// Slider header

const headerInfoSlides = document.querySelectorAll('.header__info');
const circlesHeaderContainer = document.querySelector('.circles--header');
let curSlide = 0;
const maxSlide = headerInfoSlides.length;

const circlesGalleryContainer = document.querySelector('.circles--gallery');

const goToSlide = function (slide) {
  headerInfoSlides.forEach((el, i) => {
    el.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
goToSlide(0);

const createCircle = function () {
  headerInfoSlides.forEach((_, i) => {
    circlesHeaderContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="circles__circle" data-circle="${i}"></div>`
    );
  });
};
createCircle();

// Activate dot
const activateDot = function (slide) {
  document
    .querySelectorAll('.circles__circle')
    .forEach((dot) => dot.classList.remove('circles__circle--active'));

  document
    .querySelector(`.circles__circle[data-circle="${slide}"`)
    .classList.add('circles__circle--active');
};
activateDot(0);

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const slideAfter5Sec = setInterval(nextSlide, 5000);

circlesHeaderContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('circles__circle')) return;
  clearInterval(slideAfter5Sec);

  activateDot(e.target.dataset.circle);
  goToSlide(e.target.dataset.circle);
});
