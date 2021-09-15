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

  //   mainVideo.pause();
  //   play.classList.remove('fa-pause');
  //   play.classList.add('fa-play');

  //   play.style.display = 'block';
});

document.addEventListener('keydown', (e) => {
  search.forEach((s) => {
    if (e.key === 'Escape') s.classList.remove('active');
  });
});

///////////////////////////////////////////////////////
// Video

const play = document.querySelector('.video-container__icon');
const mainVideo = document.querySelector('.video-container__img');

const displayBlock1 = () => (play.style.display = 'block');
const displayNone1 = () => (play.style.display = 'none');
play.addEventListener('click', (e) => {
  const cls = play.classList[2];

  if (cls === 'fa-play') {
    e.target.classList.remove('fa-play');
    e.target.classList.add('fa-pause');
    mainVideo.play();
    e.target.style.display = 'none';
  } else {
    e.target.classList.remove('fa-pause');
    e.target.classList.add('fa-play');
    mainVideo.pause();
    e.target.style.display = 'block';
  }

  mainVideo
    .closest('.video-container__image')
    .addEventListener('mouseover', displayBlock1);

  mainVideo
    .closest('.video-container__image')
    .addEventListener('mouseout', displayNone1);
});

mainVideo.addEventListener('ended', () => {
  play.classList.remove('fa-pause');
  play.classList.add('fa-play');
  displayBlock();

  mainVideo
    .closest('.video-container__image')
    .removeEventListener('mouseover', displayBlock1);

  mainVideo
    .closest('.video-container__image')
    .removeEventListener('mouseout', displayNone1);

  console.log('działa');
});

const playPause = function (e) {
  e.preventDefault();

  if (!lightBoxContainerVideo.classList.contains('lightbox--active')) {
    if (e.key === ' ') {
      if (mainVideo.paused) {
        mainVideo.play();

        play.classList.remove('fa-play');
        play.classList.add('fa-pause');
        // mainVideo.play();
        displayNone1();
      } else {
        mainVideo.pause();
        play.classList.remove('fa-pause');
        play.classList.add('fa-play');

        displayBlock1();
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

    displayBlock1();

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseover', displayBlock1);

    mainVideo
      .closest('.video-container__image')
      .removeEventListener('mouseout', displayNone1);
  }
};

const mainVideoObserver = new IntersectionObserver(entriesFunction, {
  root: null,
  threshold: 0.2,
});

mainVideoObserver.observe(mainVideo);

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
  <button class="lightbox__btn lightbox__btn--right" id="right">&rarr;</button>
  <button class="lightbox__btn lightbox__btn--left" id="left">&larr;</button>
  `
);

const lightboxImage = lightboxContainerGallery.querySelector('.lightbox__img');
let lightboxEnabled;
let arrayGallery;

// const lightboxBtns = document.querySelectorAll('.lightbox__btn');
// const lightboxBtnLeft = document.querySelector('#left');
// const lightboxBtnLeft = document.querySelector('.lightbox__btn--left');
// const lightboxBtnRight = document.querySelector('#right');
// const lightboxBtnRight = document.querySelector('.lightbox__btn--right');

const lightboxBtns = document.querySelectorAll('.lightbox__btn');
const lightboxPlayIcons = document.querySelector(
  '.video-container__icon--lightbox'
);

// functions

const setActive = (lightboxSrc, originalSrc, array) => {
  lightboxSrc.src = originalSrc.getAttribute('src');
  active = array.indexOf(originalSrc);
  console.log(active);
};

let lightboxBtnLeft;
let lightboxBtnRight;

const switchBtnAddHidden = () => {
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
  // lightboxBtnLeft.focus();
  lightbox.forEach((lb) => {
    if (
      lb.classList.contains('lightbox--video') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayVideo.length - 1;
    } else if (
      lb.classList.contains('lightbox--gallery') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayGallery.length - 1;
    }
  });

  active === 0
    ? setActive(lightboxSrc, end, array)
    : setActive(lightboxSrc, basic, array);

  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');
  // removeBtnAnimation();

  switchBtnAddHidden();
};

const transitionSlidesRight = (lightboxSrc, array, first, basic) => {
  // lightboxBtnRight.focus();

  lightbox.forEach((lb) => {
    if (
      lb.classList.contains('lightbox--video') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayVideo.length - 1;
    } else if (
      lb.classList.contains('lightbox--gallery') &&
      lb.classList.contains('lightbox--active')
    ) {
      last = arrayGallery.length - 1;
    }
  });

  active === last
    ? setActive(lightboxSrc, first, array)
    : setActive(lightboxSrc, basic, array);

  lightboxPlayIcons.classList.remove('fa-pause');
  lightboxPlayIcons.classList.add('fa-play');

  // removeBtnAnimation();
  switchBtnAddHidden();
};

// event listener

const displayBlock = () => (lightboxPlayIcons.style.display = 'block');
const displayNone = () => (lightboxPlayIcons.style.display = 'none');

videoWrapper.addEventListener('click', (e) => {
  if (!e.target.closest('.video-container__image')) return;

  lightBoxContainerVideo.classList.add('lightbox--active');

  const video = e.target
    .closest('.video-container__image')
    .querySelector('source');

  setActive(lightboxVideoSrc, video, arrayVideo);
  switchBtnAddHidden();
  lightboxVideoSrc.parentElement.load();

  lightboxPlayIcons.addEventListener('click', (e) => {
    const cls = lightboxPlayIcons.classList[3];

    if (cls === 'fa-play') {
      e.target.classList.remove('fa-play');
      e.target.classList.add('fa-pause');
      lightboxVideo.play();
      e.target.style.display = 'none';
    } else {
      e.target.classList.remove('fa-pause');
      e.target.classList.add('fa-play');
      lightboxVideo.pause();
      e.target.style.display = 'block';
    }

    lightboxVideo
      .closest('.video-container--lightbox')
      .addEventListener('mouseover', displayBlock);

    lightboxVideo
      .closest('.video-container--lightbox')
      .addEventListener('mouseout', displayNone);
  });

  lightboxVideo.addEventListener('ended', () => {
    lightboxPlayIcons.classList.remove('fa-pause');
    lightboxPlayIcons.classList.add('fa-play');
    displayBlock();

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseover', displayBlock);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseout', displayNone);
  });
});

galleryWrapper.forEach((wrapper) => {
  wrapper.addEventListener('click', (e) => {
    if (!e.target.closest('.gallery__image')) return;
    lightboxEnabled = wrapper.querySelectorAll('.gallery__img');

    arrayGallery = Array.from(lightboxEnabled);

    // lastImage = arrayGallery.length - 1;
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
  )
    lightBoxContainerVideo.classList.remove('lightbox--active');

  if (
    lightboxContainerGallery.classList.contains('lightbox--active') &&
    e.key === 'Escape'
  )
    lightboxContainerGallery.classList.remove('lightbox--active');
});

// document.addEventListener('keydown', (e) => {
//   if (!lightBoxContainerVideo.classList.contains('lightbox--active')) return;
//   if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;

//   e.key === 'ArrowRight'
//     ? transitionSlidesRight(
//         lightboxVideoSrc,
//         arrayVideo,
//         arrayVideo[0],
//         arrayVideo[
//           active
//         ].parentElement.parentElement.parentElement.nextElementSibling?.querySelector(
//           'source'
//         )
//       )
//     : transitionSlidesLeft(
//         lightboxVideoSrc,
//         arrayVideo,
//         arrayVideo[
//           active
//         ].parentElement.parentElement.parentElement.previousElementSibling?.querySelector(
//           'source'
//         ),
//         arrayVideo[last]
//       );

//   lightboxVideoSrc.parentElement.load();

//   // lightboxPlayIcons.classList.remove('fa-pause');
//   // lightboxPlayIcons.classList.add('fa-play');
//   displayBlock();

//   lightboxVideo
//     .closest('.video-container--lightbox')
//     .removeEventListener('mouseover', displayBlock);

//   lightboxVideo
//     .closest('.video-container--lightbox')
//     .removeEventListener('mouseout', displayNone);
// });

// document.addEventListener('keydown', (e) => {
//   if (!lightboxContainerGallery.classList.contains('lightbox--active')) return;
//   if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;

//   e.key === 'ArrowRight'
//     ? transitionSlidesRight(
//         lightboxImage,
//         arrayGallery,
//         arrayGallery[0],
//         arrayGallery[active].parentElement.nextElementSibling?.firstElementChild
//       )
//     : transitionSlidesLeft(
//         lightboxImage,
//         arrayGallery,
//         arrayGallery[active].parentElement.previousElementSibling
//           ?.firstElementChild,
//         arrayGallery[last]
//       );

//   // if (active === last) {
//   //   lightboxBtns.forEach((btn) => {
//   //     if (btn.id.includes('right')) btn.style.display = 'none';
//   //   });
//   //   document.removeEventListener('keydown', x);
//   // }
// });

lightboxBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox--video')) return;

    e.currentTarget.id.includes('left')
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

    displayBlock();

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseover', displayBlock);

    lightboxVideo
      .closest('.video-container--lightbox')
      .removeEventListener('mouseout', displayNone);

    // switchBtnAddHidden();
  });
});

lightboxBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox--gallery')) return;

    e.currentTarget.id.includes('left')
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

    // switchBtnAddHidden();
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
  // lightboxBtns.forEach(btn => {
  //   btn.style.displa
  // })
});

document.addEventListener('keydown', (e) => {
  if (lightBoxContainerVideo.classList.contains('lightbox--active')) {
    e.preventDefault();
    if (e.key === ' ') {
      if (lightboxVideo.paused) {
        lightboxVideo.play();

        lightboxPlayIcons.classList.remove('fa-play');
        lightboxPlayIcons.classList.add('fa-pause');
        // lightboxPlayIcons.play();
        lightboxPlayIcons.style.display = 'none';

        lightboxVideo
          .closest('.video-container--lightbox')
          .addEventListener('mouseover', displayBlock);

        lightboxVideo
          .closest('.video-container--lightbox')
          .addEventListener('mouseout', displayNone);
      } else {
        lightboxVideo.pause();
        lightboxPlayIcons.classList.remove('fa-pause');
        lightboxPlayIcons.classList.add('fa-play');

        lightboxPlayIcons.style.display = 'block';

        lightboxVideo
          .closest('.video-container--lightbox')
          .removeEventListener('mouseover', displayBlock);

        lightboxVideo
          .closest('.video-container--lightbox')
          .removeEventListener('mouseout', displayNone);
      }
    }
  }
});

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

document.addEventListener('keydown', function (e) {
  if (!lightboxContainerGallery.classList.contains('lightbox--active')) return;
  if (e.key === 'ArrowLeft' && active !== 0) {
    console.log('działa');
    transitionSlidesLeft(
      lightboxImage,
      arrayGallery,
      arrayGallery[active].parentElement.previousElementSibling
        ?.firstElementChild,
      arrayGallery[last]
    );
  }

  if (e.key === 'ArrowRight' && active !== last) {
    console.log('działa');
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

  displayBlock();

  lightboxVideo
    .closest('.video-container--lightbox')
    .removeEventListener('mouseover', displayBlock);

  lightboxVideo
    .closest('.video-container--lightbox')
    .removeEventListener('mouseout', displayNone);
});
