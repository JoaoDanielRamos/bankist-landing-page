'use strict';

// TODO ## MODAL WINDOW ##

// ? ## VARIABLES ##
const modal = document.querySelector('.modal'),
  btnCloseModal = document.querySelector('.btn--close-modal'),
  btnsOpenModal = Array.from(document.querySelectorAll('.btn--show-modal')),
  overlay = document.querySelector('.overlay'),
  btnScrollTo = document.querySelector('.btn--scroll-to'),
  section1 = document.querySelector('#section--1'),
  navMenu = document.querySelector('.nav'),
  tabsContainer = document.querySelector('.operations__tab-container'),
  tabs = Array.from(document.querySelectorAll('.operations__tab')),
  tabsContent = Array.from(document.querySelectorAll('.operations__content'));

// ? ## FUNCTIONS ##

// ! 1. OPEN MODAL
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// ! 2. CLOSE MODAL
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// ! 3. MOUSE OVER AND OUT
let mouseHoverEvent = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = Array.from(
      link.closest('.nav').querySelectorAll('.nav__link')
    );
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== link) {
        element.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

// ? ## EVENT LISTENERS ##

// ! BUTTONS OPEN MODAL
btnsOpenModal.forEach(button => {
  button.addEventListener('click', openModal);
});

// ! BUTTON CLOSE MODAL
btnCloseModal.addEventListener('click', closeModal);

// ! OVERLAY
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ! SCROLL NAVIGATION
document.querySelector('.nav__links').addEventListener('click', event => {
  event.preventDefault();

  if (event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ! TABS CONTAINER

tabsContainer.addEventListener('click', event => {
  const clicked = event.target.closest('.operations__tab');

  // If it fails, end the process
  if (!clicked) return;

  // Deactivate all tabs
  tabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Deactivate all active content
  tabsContent.forEach(content => {
    content.classList.remove('operations__content--active');
  });

  // Activate the content area based on active tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// When the mouse is hovering the nav menu
navMenu.addEventListener('mouseover', mouseHoverEvent.bind(0.5));

// When the mouse
navMenu.addEventListener('mouseout', mouseHoverEvent.bind(1));

// ? ## COMPONENTS

// ! COOKIE MESSAGE
// Component structure
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie"> Got it! </button>';
message.style.backgroundColor = '#37383d';
message.style.width = '100vw';
message.style.height = '70px';

// Inserting to DOM
const header = document.querySelector('.header');
header.append(message);

// Remove it if clicked
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// ! STICKY NAVIGATION - WAY 1
// const initialCords = section1.getBoundingClientRect();

// window.addEventListener('scroll', event => {
//   if (window.scrollY >= initialCords.top) navMenu.classList.add('sticky');
//   else navMenu.classList.remove('sticky');
// });

// ! STICKY NAVIGATION - WAY 2
let navHeight = navMenu.getBoundingClientRect().height;

// Intersection Observer API
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting === false) {
    navMenu.classList.add('sticky');
  } else {
    navMenu.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});

headerObserver.observe(header);

// ! REVEALING OBJECTS
// Array with all section elements
const allSections = Array.from(document.querySelectorAll('.section'));

const revealSection = function (entries, observer) {
  let [entry] = entries;
  // console.log(entry);

  if (entry.isIntersecting === true) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// ! LAZY LOAD IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, observer) {
  let [entry] = entries;
  console.log(entry);

  if (entry.isIntersecting === true) {
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(image => imgObserver.observe(image));

// ! SLIDER

// * variables
const slider = document.querySelector('.slider'),
  slides = Array.from(document.querySelectorAll('.slide')),
  btnSliderLeft = document.querySelector('.slider__btn--left'),
  btnSliderRight = document.querySelector('.slider__btn--right'),
  dotContainer = document.querySelector('.dots');

// * setting values
let currentSlide = 0;
const maxSlides = slides.length;

// * function go to slide
const goToSlide = slideNumber => {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - slideNumber)}%)`;
  });

  // * activating dot
  allDots.forEach((dot, index) => {
    if (index === slideNumber) {
      dot.classList.add('dots__dot--active');
    } else {
      dot.classList.remove('dots__dot--active');
    }
  });

  currentSlide = slideNumber;
};

// * next slide
const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
};

// * previous slide
const nextSlide = () => {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

// * button left on slider
btnSliderLeft.addEventListener('click', prevSlide);

// * button right on slider
btnSliderRight.addEventListener('click', nextSlide);

// * move to next or previous slide trough key event
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    nextSlide();
  } else if (event.key === 'ArrowLeft') {
    prevSlide();
  }
  console.log(event);
});

// * create dot elements
let createDots = () => {
  // * creating all dots
  slides.forEach((slide, slideIndex) => {
    let leDot = document.createElement('div');
    leDot.classList.add('dots__dot');
    dotContainer.append(leDot);
  });
};

// * add click functionality to all tods
const addClickToDots = () => {
  // * adding the click functionality to all dots
  slides.forEach((_, slideIndex) => {
    allDots.forEach((dot, dotIndex) => {
      if (slideIndex === dotIndex) {
        dot.addEventListener('click', () => {
          goToSlide(dotIndex);
        });
      }
    });
  });
};

createDots();
// * selecting all dots
const allDots = Array.from(document.querySelectorAll('.dots__dot'));
addClickToDots();

goToSlide(0);

document.addEventListener('DOMContentLoaded', event => {
  console.log('I think its working', event);
});

window.addEventListener('load', event => {
  console.log('Page fully loaded', event);
});

window.addEventListener('beforeunload', event => {
  event.preventDefault();
  console.log('Are you sure you want to leave the page?', event);
  event.returnValue = '';
});
