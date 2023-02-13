'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const scrollToBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(open => open.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //I could also do that in the parent event handler
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //do not anchor to #section--1,2,3

  const id = e.target.getAttribute('href'); //get id of nav anchor link

  if (e.target.classList.contains('nav__link'))
    //check if it is the right child event
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
});

const tab = document.querySelector('.operations__tab-container');
const buttons = tab.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

tab.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  buttons.forEach(button => button.classList.remove('operations__tab--active'));

  if (!clicked) return;

  clicked.classList.add('operations__tab--active');

  const number = clicked.dataset.tab;

  tabsContent.forEach(block =>
    block.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${number}`)
    .classList.add('operations__content--active');
});

// Menu bar hovering
const hoverOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const parent = e.target.closest('.nav');
    const img = parent.querySelector('img');
    const links = parent.querySelectorAll('.nav__link');

    links.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
    img.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverOpacity.bind(0.5));

nav.addEventListener('mouseout', hoverOpacity.bind(1));

//Intersection observer for header fixing
const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;

const callback = function (events, observer) {
  const [event] = events; //events happen when every threshold passes (that's why the LOOP)
  !event.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const intrObs = new IntersectionObserver(callback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

intrObs.observe(header);

//Intersection observer for sections revealing
const allSections = document.querySelectorAll('section');
const callbackSection = function (events, observer) {
  const [event] = events;
  if (!event.isIntersecting) return;
  // console.log(event);

  event.target.classList.remove('section--hidden');
  observer.unobserve(event.target);
};

const intrObsSection = new IntersectionObserver(callbackSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  intrObsSection.observe(section);
});

//Lazy loading images
const lazyImages = document.querySelectorAll('.features__img');

const lazyImgCallback = function (events, observer) {
  const [event] = events;
  if (!event.isIntersecting) return;

  const newSrc = event.target.getAttribute('data-src');

  event.target.setAttribute('src', newSrc);

  event.target.addEventListener('load', function () {
    event.target.classList.remove('lazy-img');
  });

  observer.unobserve(event.target);
};

const lazyImgIntrObs = new IntersectionObserver(lazyImgCallback, {
  root: null,
  threshold: 0.5,
  rootMargin: '200px',
});

lazyImages.forEach(img => {
  lazyImgIntrObs.observe(img);
});

//transform: translateX(0%);

// Sliding with buttons
const sliding = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  let crrSlide = 0;
  const maxSlide = slides.length;

  const makeDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dt => dt.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (crrSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - crrSlide)}%)`;
    });
    activateDot(crrSlide);
  };

  const init = function () {
    makeDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  const funcSliderRight = function () {
    if (crrSlide === maxSlide - 1) {
      crrSlide = 0;
    } else {
      crrSlide++;
    }
    goToSlide(crrSlide);
  };

  const funcSliderLeft = function () {
    if (crrSlide === 0) {
      crrSlide = maxSlide - 1;
    } else {
      crrSlide--;
    }
    goToSlide(crrSlide);
  };

  //Event Handlers

  btnRight.addEventListener('click', funcSliderRight);
  btnLeft.addEventListener('click', funcSliderLeft);

  dotContainer.addEventListener('click', function (e) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  });

  document.addEventListener('keydown', function (e) {
    e.key == 'ArrowLeft' && funcSliderLeft();
    e.key == 'ArrowRight' && funcSliderRight();
  });
};
sliding();

//////////////////////////////////////
////// Lectures
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

console.log(document.querySelector('.header'));

// Nodelist;;; --- Does not updates itself.
const sections = document.querySelectorAll('.section');
console.log(sections);

// HTML Collection --- It is a live collection (updates itself continuosly)
const buttons = document.getElementsByTagName('button');
console.log(buttons);

// HTML Collection "by classname";;;
console.log(document.getElementsByClassName('btn'));
*/

//Create new DOM Element;;;
const message = document.createElement('div');

//Adding new classes to elements
message.classList.add('cookie-message');
// message.classList.toggle('cookie-message');
// message.classList.remove('cookie-message');
// message.classList.replace('cookie-message');
// message.classList.contains('cookie-message');
message.innerHTML = `We use cookies for improved performance to spy on you. <button class="btn btn--close-cookie">Got it!</button>`;

//Adding element into the DOM;
// const header = document.querySelector('.header');

header.append(message); //add as a last child element
// header.prepend(message); //add as a first child element
//can only use one of these
// header.append(message.cloneNode(true)); //to use append/prepend together

// To use as siblings
// header.before(message);
// header.after(message);

//Delete elements;;;
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //can't use on older versions of browsers
    // message.parentElement.removeChild(message); //old method called "DOM traversing";
  });

//---------------Styles---------------
message.style.backgroundColor = '#37383d';
message.style.width = '104%';

// console.log(message.style.height); //will not return anything because "style" method only returns inline styles.

// console.log(getComputedStyle(message).height); //RIGHT method to get styles

message.style.height =
  Number.parseInt(getComputedStyle(message).height) + 40 + 'px';

//set styles to all elements in a document
// document.documentElement.style.setProperty('--color-primary', 'orangered');
/*
//-------------Attributes------------------
const logo = document.querySelector('.nav__logo');

console.log(logo.src); //this is an absolute link
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'this is a fucked up logo';

//Non-standard attributes;;;
console.log(logo.designer);

console.log(logo.getAttribute('designer'));
logo.setAttribute('humping', 'a lot');
console.log(logo.getAttribute('humping'));

//Relative and absolute links and source
console.log(logo.src); //absolute
console.log(logo.getAttribute('src')); //realtive

//same with links
const link = document.querySelector('.nav__link');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data Attributes
console.log(logo.dataset.versionNumber);

//---------------Classes-------------
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.contains('c');
logo.classList.toggle('c');

//Don't use
logo.className = 'Hanzla-is-GOD'; //overrides all classes and adds itself
*/

scrollToBtn.addEventListener('click', function (e) {
  // console.log(
  //   'Co-ordinates relative to the scroll: ',
  //   window.pageXOffset,
  //   window.pageYOffset
  // );
  // console.log(
  //   'Viewport Height and Width: ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // const scrollBtnCoords = e.target.getBoundingClientRect();
  // const section1Coords = section1.getBoundingClientRect();
  // window.scrollTo(
  //   //Old School way of scrolling
  //   {
  //     left: section1Coords.left + window.pageXOffset,
  //     top: section1Coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   }
  // );

  section1.scrollIntoView({ behavior: 'smooth' }); //modern way of scrolling (might not happen on older versions)
});
/*
//Event Listners;;; 3 types
const h1 = document.querySelector('h1');
//1)
h1.addEventListener('mouseenter', function (e) {
  alert('eventlistener: You clicked the heading!');
});

// //2)
h1.onmouseenter = function (e) {
  alert('onmouseenter: You hovered on the heading');
};

//3)
// HTML atrribute = <h1 onmouseenter='alert(html: you hovered on heading)'></h1>

//Delete Event Listeners;;; =>"use a global function for this"
const alerth1 = function (e) {
  alert('eventlistener: You hovered on the heading!');
  // h1.removeEventListener('mouseenter', alerth1); //THIS DELETES AFTER LISTENING EVENT ONE TIME
  // setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 5000); //THIS DELETES EVENT AFTER CERTAIN TIME
};

h1.addEventListener('mouseenter', alerth1);

const randomInt = (max, min) =>
Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
  
//Event Propagation: Bubbling & Capturing
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
  
  //Stop Propagation:
  // e.stopPropagation(); //SHOULD ONLY BE USED IN COMPLEX MULTIPLE EVENT HANDLERS
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV BAR', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('HEADER', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
});

// document.querySelector('.nav').addEventListener(
  //   //now this event happens during the capturing phase so it executes first
  //   'click',
  //   function (e) {
    //     this.style.backgroundColor = randomColor();
    //     console.log('HEADER', e.target, e.currentTarget);
    //     console.log(this === e.currentTarget);
    //   },
    //   true
    // );
    
    -------------Lazy Loding/Scroll Reveal/Header fixed after scroll----------
const distanceFromTop = section1.getBoundingClientRect().top + window.pageYOffset;

NAV bar fixed after section1 --- not efficient
window.addEventListener('scroll', function () {
    window.pageYOffset > distanceFromTop
      ? nav.classList.add('sticky')
      : nav.classList.remove('sticky');
  });
  
  Intersection Observer;;;
  
  const footer = document.querySelector('.footer');
  const callback = function (events, observer) {
      console.log('Fuck yeah');
      events.forEach(event => console.log(event));
      console.log(observer);
    };
    const options = {
  root: null,
  threshold: [0, 0.5],
  // rootMargin: '-50px',
};

const intObs = new IntersectionObserver(callback, options);

intObs.observe(footer);
*/
