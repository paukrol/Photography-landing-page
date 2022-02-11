'use strict';
const menuBar = document.querySelector('.menu-bars');

// Hidden / unhidden search icon
const search = document.querySelectorAll('.menu__item--search');

search.forEach((s) => {
  s.addEventListener('click', (e) => {
    e.currentTarget.classList.add('active');
  });
});

document.addEventListener('click', (e) => {
  search.forEach((s) => {
    if (e.target.closest('.menu__item--search')) return;
    s.classList.remove('active');
  });

  lightbox.forEach((lb) => {
    if (lb.classList.contains('lightbox--active')) {
      mainVideo.pause();
      play.classList.remove('fa-pause');
      play.classList.add('fa-play');
      play.style.display = 'block';
    }
  });
});

document.addEventListener('keydown', (e) => {
  search.forEach((s) => {
    if (e.key === 'Escape') s.classList.remove('active');
  });
});

////////////////////////////////////////////////////////////
// Sliders

const headerSlides = document.querySelectorAll('.header__slide');
const gallerySlides = document.querySelectorAll('.gallery__wrapper');

const circlesHeaderWrapper = document.querySelector('.circles--header');
const circlesGalleryWrapper = document.querySelector('.circles--gallery');

const circleHeaderClass = 'circles__circle--header';
const circleGalleryClass = 'circles__circle--gallery';

let curSlide = 0;
const maxSlide = headerSlides.length;

// Function
const goToSlide = function (slidesContainer, slide) {
  slidesContainer.forEach((el, i) => {
    el.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};

const createCircle = function (slidesContainer, dotsWrapper, cls) {
  slidesContainer.forEach((_, i) => {
    dotsWrapper.insertAdjacentHTML(
      'beforeend',
      `<div class="circles__circle ${cls}" data-circle="${i}"></div>`
    );
  });
};

const activateDot = function (dotsWrapper, type, slide) {
  dotsWrapper.forEach((dot) => dot.classList.remove('circles__circle--active'));

  document
    .querySelector(`.circles__circle--${type}[data-circle="${slide}"`)
    .classList.add('circles__circle--active');
};

// Header
const headerInit = function () {
  goToSlide(headerSlides, 0);
  createCircle(headerSlides, circlesHeaderWrapper, circleHeaderClass);

  const circleHeader = document.querySelectorAll('.circles__circle--header');

  activateDot(circleHeader, 'header', 0);

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(headerSlides, curSlide);
    activateDot(circleHeader, 'header', curSlide);
  };

  const slideAfter5Sec = setInterval(nextSlide, 5000);

  circlesHeaderWrapper.addEventListener('click', (e) => {
    if (!e.target.classList.contains(circleHeaderClass)) return;
    clearInterval(slideAfter5Sec);

    activateDot(circleHeader, 'header', e.target.dataset.circle);
    goToSlide(headerSlides, e.target.dataset.circle);
  });
};

headerInit();

// Gallery
const galleryInit = function () {
  goToSlide(gallerySlides, 0);
  createCircle(gallerySlides, circlesGalleryWrapper, circleGalleryClass);

  const circleGallery = document.querySelectorAll('.circles__circle--gallery');

  activateDot(circleGallery, 'gallery', 0);

  circlesGalleryWrapper.addEventListener('click', (e) => {
    if (!e.target.classList.contains(circleGalleryClass)) return;

    activateDot(circleGallery, 'gallery', e.target.dataset.circle);
    goToSlide(gallerySlides, e.target.dataset.circle);
  });
};

galleryInit();

///////////////////////////////////////////////////////
// Video

const displayBlock = (playPauseBtn) => (playPauseBtn.style.display = 'block');
const displayNone = (playPauseBtn) => (playPauseBtn.style.display = 'none');

const play = document.querySelector('.video-container__icon');
const mainVideo = document.querySelector('.video-container__img');

const displayBlockMainVideo = displayBlock.bind(null, play);
const displayNoneMainVideo = displayNone.bind(null, play);

play.addEventListener('click', (e) => {
  if (mainVideo.paused) {
    e.target.classList.remove('fa-play');
    e.target.classList.add('fa-pause');
    mainVideo.play();
    displayNoneMainVideo();

    mainVideo
      .closest('.video-container__image')
      .addEventListener('mouseover', displayBlockMainVideo);

    mainVideo
      .closest('.video-container__image')
      .addEventListener('mouseout', displayNoneMainVideo);
  } else {
    e.target.classList.remove('fa-pause');
    e.target.classList.add('fa-play');
    mainVideo.pause();
    displayBlockMainVideo();

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseover', displayBlockMainVideo);

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseout', displayNoneMainVideo);
  }
});

mainVideo.addEventListener('ended', () => {
  play.classList.remove('fa-pause');
  play.classList.add('fa-play');
  displayBlock(play);

  mainVideo
    .closest('.video-container__image')
    .removeEventListener('mouseover', displayBlockMainVideo);

  mainVideo
    .closest('.video-container__image')
    .removeEventListener('mouseout', displayNoneMainVideo);
});

let isMouseHover = false;

mainVideo
  .closest('.video-container__image')
  .addEventListener('mouseover', () => {
    isMouseHover = true;
  });

mainVideo
  .closest('.video-container__image')
  .addEventListener('mouseout', () => {
    isMouseHover = false;
  });

const playPause = function (e) {
  e.preventDefault();

  if (!lightBoxContainerVideo.classList.contains('lightbox--active')) {
    if (e.key === ' ') {
      if (mainVideo.paused) {
        mainVideo.play();

        play.classList.remove('fa-play');
        play.classList.add('fa-pause');

        if (!isMouseHover) {
          displayNone(play);
        }

        mainVideo
          .closest('.video-container__image')
          .addEventListener('mouseover', displayBlockMainVideo);

        mainVideo
          .closest('.video-container__image')
          .addEventListener('mouseout', displayNoneMainVideo);
      } else {
        mainVideo.pause();
        play.classList.remove('fa-pause');
        play.classList.add('fa-play');

        displayBlock(play);

        mainVideo
          .closest('.video-container__image')
          .removeEventListener('mouseover', displayBlockMainVideo);

        mainVideo
          .closest('.video-container__image')
          .removeEventListener('mouseout', displayNoneMainVideo);
      }
    }
  }
};

const entriesFunction = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (entry.isIntersecting) {
    document.addEventListener('keydown', playPause);
  } else {
    document.removeEventListener('keydown', playPause);

    mainVideo.pause();
    play.classList.remove('fa-pause');
    play.classList.add('fa-play');
    displayBlock(play);

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseover', displayBlockMainVideo);

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseout', displayNoneMainVideo);
  }
};

const mainVideoObserver = new IntersectionObserver(entriesFunction, {
  root: null,
  threshold: 0.2,
});

mainVideoObserver.observe(mainVideo);

// //////////////////////////////////////////////////////////////////
// Lightbox Video

const lightbox = document.querySelectorAll('.lightbox');

const lightBoxContainerVideo = document.querySelector('.lightbox--video');
const videoWrapper = document.querySelector('.video-container--toLightbox');

lightBoxContainerVideo.insertAdjacentHTML(
  'beforeend',
  `<div class="video-container video-container--lightbox">
    <video class="video-container__img video-container__img--lightbox">
      <source type="video/mp4" />
    </video>
    <i class="video-container__icon video-container__icon--lightbox fas fa-play"></i>
  </div>

  <button class="lightbox__btn lightbox__btn--right">&rarr;</button>
  <button class="lightbox__btn lightbox__btn--left">&larr;</button>
  `
);

const lightboxVideoSrc = lightBoxContainerVideo.querySelector('source');
const lightboxVideo = lightBoxContainerVideo.querySelector(
  '.video-container__img--lightbox'
);

const videoSrcAll = videoWrapper.querySelectorAll('source');
const arrayVideo = Array.from(videoSrcAll);
let active;
let last;

// //////////////////////////////////////////////////////////////////
// // Lightbox Gallery

const lightboxContainerGallery = document.querySelector('.lightbox--gallery');
const galleryWrapper = document.querySelectorAll('.gallery__wrapper');

lightboxContainerGallery.insertAdjacentHTML(
  'beforeend',
  `<div class="lightbox__image">
    <img class="lightbox__img"/>
  </div>
  <button class="lightbox__btn lightbox__btn--right">&rarr;</button>
  <button class="lightbox__btn lightbox__btn--left">&larr;</button>
  `
);

const lightboxImage = lightboxContainerGallery.querySelector('.lightbox__img');
let lightboxEnabled;
let arrayGallery;

const lightboxBtns = document.querySelectorAll('.lightbox__btn');
let lightboxBtnLeft;
let lightboxBtnRight;
const lightboxPlayIcons = document.querySelector(
  '.video-container__icon--lightbox'
);

// functions

const displayBlockLightbox = displayBlock.bind(null, lightboxPlayIcons);
const displayNoneLightbox = displayNone.bind(null, lightboxPlayIcons);

const checkPause = function () {
  lightboxVideo.play();
  lightboxPlayIcons.classList.remove('fa-play');
  lightboxPlayIcons.classList.add('fa-pause');
  displayNoneLightbox();
};

const checkPlay = function () {
  lightboxVideo.pause();
  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');
  displayBlockLightbox();
};

const removeBtnAnimation = function () {
  setTimeout(() => {
    lightboxBtnLeft.blur();
    lightboxBtnRight.blur();
  }, 200);
};

const setActive = (lightboxSrc, originalSrc, array) => {
  lightboxSrc.src = originalSrc.getAttribute('src');
  active = array.indexOf(originalSrc);

  console.log(window.innerWidth, window.innerHeight);

  lightboxImage.style.height = 'auto';
  lightboxImage.style.width = 'auto';
  // console.log(lightboxImage.width, lightboxImage.height);

  if (window.innerWidth > window.innerHeight) {
    lightboxImage.style.height = '100%';
    if (lightboxImage.width > window.innerWidth) {
      lightboxImage.style.width = '100%';
      lightboxImage.style.height = 'auto';
    } else {
      lightboxImage.style.width = 'auto';
    }
  } else if (window.innerWidth < window.innerHeight) {
    if (lightboxImage.width < lightboxImage.height) {
      lightboxImage.style.height = '100%';
      // console.log(lightboxImage.width, lightboxImage.height);
      if (lightboxImage.width > window.innerWidth) {
        lightboxImage.style.width = '100%';
        lightboxImage.style.height = 'auto';
      } else {
        lightboxImage.style.height = '100%';
        lightboxImage.style.width = 'auto';
      }
    } else {
      lightboxImage.style.width = '100%';
      lightboxImage.style.height = 'auto';
    }
  }
  // console.log(lightboxImage.width, lightboxImage.height);
};

const checkLightbox = function () {
  lightbox.forEach((lb) => {
    if (
      lb.classList.contains('lightbox--video') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayVideo.length - 1;
      lightboxBtnLeft = lb.querySelector('.lightbox__btn--left');
      lightboxBtnRight = lb.querySelector('.lightbox__btn--right');
    } else if (
      lb.classList.contains('lightbox--gallery') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayGallery.length - 1;
      lightboxBtnLeft = lb.querySelector('.lightbox__btn--left');
      lightboxBtnRight = lb.querySelector('.lightbox__btn--right');
    }
  });
};

const switchBtnAddHidden = () => {
  checkLightbox();

  lightboxBtnLeft.classList.remove('lightbox__btn--inactive');
  lightboxBtnRight.classList.remove('lightbox__btn--inactive');
  switch (active) {
    case 0:
      lightboxBtnLeft.classList.add('lightbox__btn--inactive');
      break;
    case last:
      lightboxBtnRight.classList.add('lightbox__btn--inactive');
      break;
    default:
      lightboxBtnLeft.classList.remove('lightbox__btn--inactive');
      lightboxBtnRight.classList.remove('lightbox__btn--inactive');
  }
};

const transitionSlidesLeft = (lightboxSrc, array, basic, end) => {
  lightboxBtnLeft.focus();

  active === 0
    ? setActive(lightboxSrc, end, array)
    : setActive(lightboxSrc, basic, array);

  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');
  switchBtnAddHidden();
  removeBtnAnimation();
};

const transitionSlidesRight = (lightboxSrc, array, first, basic) => {
  lightboxBtnRight.focus();

  active === last
    ? setActive(lightboxSrc, first, array)
    : setActive(lightboxSrc, basic, array);

  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');

  switchBtnAddHidden();
  removeBtnAnimation();
};

// event listener

videoWrapper.addEventListener('click', (e) => {
  if (!e.target.closest('.video-container__image')) return;

  lightBoxContainerVideo.classList.add('lightbox--active');

  const video = e.target
    .closest('.video-container__image')
    .querySelector('source');

  setActive(lightboxVideoSrc, video, arrayVideo);
  switchBtnAddHidden();
  lightboxVideoSrc.parentElement.load();

  lightboxVideo.addEventListener('ended', () => {
    lightboxPlayIcons.classList.remove('fa-pause');
    lightboxPlayIcons.classList.add('fa-play');
    displayBlock(lightboxPlayIcons);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseover', displayBlockLightbox);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseout', displayNoneLightbox);
  });
});

galleryWrapper.forEach((wrapper) => {
  wrapper.addEventListener('click', (e) => {
    if (!e.target.closest('.gallery__image')) return;
    lightboxEnabled = wrapper.querySelectorAll('.gallery__img');

    arrayGallery = Array.from(lightboxEnabled);

    lightboxContainerGallery.classList.add('lightbox--active');

    const image = e.target
      .closest('.gallery__image')
      .querySelector('.gallery__img');

    setActive(lightboxImage, image, arrayGallery);
    switchBtnAddHidden();
  });
});

document.addEventListener('keydown', (e) => {
  if (
    lightBoxContainerVideo.classList.contains('lightbox--active') &&
    e.key === 'Escape'
  ) {
    checkPlay();
    lightBoxContainerVideo.classList.remove('lightbox--active');
  }

  if (
    lightboxContainerGallery.classList.contains('lightbox--active') &&
    e.key === 'Escape'
  )
    lightboxContainerGallery.classList.remove('lightbox--active');
});

lightboxBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox--video')) return;

    e.currentTarget.classList.contains('lightbox__btn--left')
      ? transitionSlidesLeft(
          lightboxVideoSrc,
          arrayVideo,
          arrayVideo[
            active
          ].parentElement.parentElement.parentElement.previousElementSibling?.querySelector(
            'source'
          ),
          arrayVideo[last]
        )
      : transitionSlidesRight(
          lightboxVideoSrc,
          arrayVideo,
          arrayVideo[0],
          arrayVideo[
            active
          ].parentElement.parentElement.parentElement.nextElementSibling?.querySelector(
            'source'
          )
        );

    lightboxVideoSrc.parentElement.load();

    displayBlock(lightboxPlayIcons);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseover', displayBlockLightbox);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseout', displayNoneLightbox);
  });
});

lightboxBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox--gallery')) return;

    e.currentTarget.classList.contains('lightbox__btn--left')
      ? transitionSlidesLeft(
          lightboxImage,
          arrayGallery,
          arrayGallery[active].parentElement.previousElementSibling
            ?.firstElementChild,
          arrayGallery[last]
        )
      : transitionSlidesRight(
          lightboxImage,
          arrayGallery,
          arrayGallery[0],
          arrayGallery[active].parentElement.nextElementSibling
            ?.firstElementChild
        );
  });
});

lightBoxContainerVideo.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('lightbox__btn') ||
    e.target.classList.contains('video-container__icon--lightbox')
  )
    return;

  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');

  lightBoxContainerVideo.classList.remove('lightbox--active');
});

lightboxContainerGallery.addEventListener('click', (e) => {
  if (e.target.classList.contains('lightbox__btn')) return;
  lightboxContainerGallery.classList.remove('lightbox--active');
});

lightboxPlayIcons.addEventListener('click', (e) => {
  if (lightBoxContainerVideo.classList.contains('lightbox--active')) {
    if (lightboxVideo.paused) {
      checkPause();

      lightboxVideo
        .closest('.video-container--lightbox')
        .addEventListener('mouseover', displayBlockLightbox);

      lightboxVideo
        .closest('.video-container--lightbox')
        .addEventListener('mouseout', displayNoneLightbox);
    } else {
      checkPlay();

      lightboxVideo
        .closest('.video-container--lightbox')
        .removeEventListener('mouseover', displayBlockLightbox);

      lightboxVideo
        .closest('.video-container--lightbox')
        .removeEventListener('mouseout', displayNoneLightbox);
    }
  }
});

lightboxVideo
  .closest('.video-container--lightbox')
  .addEventListener('mouseover', () => {
    isMouseHover = true;
  });

lightboxVideo
  .closest('.video-container--lightbox')
  .addEventListener('mouseout', () => {
    isMouseHover = false;
  });

document.addEventListener('keydown', (e) => {
  if (lightBoxContainerVideo.classList.contains('lightbox--active')) {
    e.preventDefault();
    if (e.key === ' ') {
      if (lightboxVideo.paused) {
        // checkPause();

        lightboxVideo.play();
        lightboxPlayIcons.classList.remove('fa-play');
        lightboxPlayIcons.classList.add('fa-pause');

        if (!isMouseHover) {
          displayNoneLightbox();
        }

        lightboxVideo
          .closest('.video-container--lightbox')
          .addEventListener('mouseover', displayBlockLightbox);

        lightboxVideo
          .closest('.video-container--lightbox')
          .addEventListener('mouseout', displayNoneLightbox);
      } else {
        // checkPlay();
        lightboxVideo.pause();
        lightboxPlayIcons.classList.remove('fa-pause');
        lightboxPlayIcons.classList.add('fa-play');
        displayBlockLightbox();

        lightboxVideo
          .closest('.video-container--lightbox')
          .removeEventListener('mouseover', displayBlockLightbox);

        lightboxVideo
          .closest('.video-container--lightbox')
          .removeEventListener('mouseout', displayNoneLightbox);
      }
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (!lightboxContainerGallery.classList.contains('lightbox--active')) return;
  if (e.key === 'ArrowLeft' && active !== 0) {
    transitionSlidesLeft(
      lightboxImage,
      arrayGallery,
      arrayGallery[active].parentElement.previousElementSibling
        ?.firstElementChild,
      arrayGallery[last]
    );
  }

  if (e.key === 'ArrowRight' && active !== last) {
    transitionSlidesRight(
      lightboxImage,
      arrayGallery,
      arrayGallery[0],
      arrayGallery[active].parentElement.nextElementSibling?.firstElementChild
    );
  }
});

document.addEventListener('keydown', (e) => {
  if (!lightBoxContainerVideo.classList.contains('lightbox--active')) return;
  if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;

  if (e.key === 'ArrowLeft' && active !== 0) {
    console.log('działa');
    transitionSlidesLeft(
      lightboxVideoSrc,
      arrayVideo,
      arrayVideo[
        active
      ].parentElement.parentElement.parentElement.previousElementSibling?.querySelector(
        'source'
      ),
      arrayVideo[last]
    );
    lightboxVideoSrc.parentElement.load();
  }

  if (e.key === 'ArrowRight' && active !== last) {
    transitionSlidesRight(
      lightboxVideoSrc,
      arrayVideo,
      arrayVideo[0],
      arrayVideo[
        active
      ].parentElement.parentElement.parentElement.nextElementSibling?.querySelector(
        'source'
      )
    );
    lightboxVideoSrc.parentElement.load();
  }

  displayBlock(lightboxPlayIcons);

  lightboxVideo
    .closest('.video-container--lightbox')
    .removeEventListener('mouseover', displayBlockLightbox);

  lightboxVideo
    .closest('.video-container--lightbox')
    .removeEventListener('mouseout', displayNoneLightbox);
});

const header = document.querySelector('.header');
menuBar.addEventListener('click', (e) => {
  header.classList.toggle('change');
});
