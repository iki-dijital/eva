import { mobileMenu } from '../lib/common';
import BlazeSlider from 'blaze-slider';
import Tab from "bootstrap/js/dist/tab";
import GLightBox from "glightbox";
import formValidate from '../lib/form';

mobileMenu();
formValidate();

const servicesBlaze = document.querySelector(
  '.services .blaze-slider'
);
const howBlaze = document.querySelector('.how .blaze-slider');
const blazeItems = document.querySelectorAll('.how .item');
const directionsButton = document.querySelector('.directions');
const prodTabs = document.getElementById("prods-tab");

function mapGo(mapLat, mapLong) {
  if (
    navigator.platform.indexOf('iPhone') !== -1 ||
    navigator.platform.indexOf('iPod') !== -1 ||
    navigator.platform.indexOf('iPad') !== -1
  ) {
    window.open(
      'maps://maps.google.com/maps?daddr=' +
        mapLat +
        ',' +
        mapLong +
        '&amp;ll='
    );
  } else {
    window.open(
      'http://maps.google.com/maps?daddr=' +
        mapLat +
        ',' +
        mapLong +
        '&amp;ll='
    );
  }
}

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

if (directionsButton !== undefined && directionsButton !== null) {
  directionsButton.addEventListener('click', function () {
    let [lat, long] = directionsButton.dataset.coordinates.split(',');
    mapGo(lat, long);
  });
}


if (prodTabs !== undefined && prodTabs !== null){
  new Tab(prodTabs);

  new GLightBox();
}