import { mobileMenu } from '../lib/common';
import BlazeSlider from 'blaze-slider';

mobileMenu();

const servicesBlaze = document.querySelector(
  '.services .blaze-slider'
);
const howBlaze = document.querySelector('.how .blaze-slider');
const blazeItems = document.querySelectorAll('.how .item');

function showItem(getIndex) {
  blazeItems.forEach((item, index) => {
    if (index === getIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

if (servicesBlaze !== undefined && servicesBlaze !== null) {
  new BlazeSlider(servicesBlaze, {
    all: {
      slidesToShow: 3,
      slideGap: '30px',
      enableAutoplay: true,
      autoplayInterval: 3000,
    },
    '(max-width: 575px)': {
      slidesToShow: 1,
      slideGap: '0px',
    },
    '(max-width: 991px)': {
      slidesToShow: 2,
      slideGap: '30px',
    },
    '(max-width: 1199px)': {
      slidesToShow: 3,
      slideGap: '15px',
    },
  });
}

if (howBlaze !== undefined && howBlaze !== null) {
  let howSlider = new BlazeSlider(howBlaze, {
    all: {
      slidesToShow: 1,
      slideGap: '0px',
      enableAutoplay: true,
      autoplayInterval: 3000,
    },
  });

  howSlider.onSlide((pageIndex) => {
    showItem(pageIndex);
  });
}
