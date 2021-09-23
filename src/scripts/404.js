import $ from 'jquery';
import 'regenerator-runtime';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import '../styles/404.css';

const initMenu = () => {
  $('.floatmenu').on('click', (event) => {
    event.stopPropagation();
    $('nav').toggleClass('open');
  });

  $('nav').on('click', (event) => {
    event.stopPropagation();
  });

  $(window).on('resize', () => {
    if ($('nav').hasClass('open') && !$('.floatmenu').is(':visible')) {
      $('nav').removeClass('open');
    }
  });

  $('main').on('click', () => {
    $('nav').removeClass('open');
  });
};

const setCopyrightDate = () => {
  $('.year').text(new Date().getFullYear());
};

const startTimer = () => {
  let timer = 5;
  const end = setInterval(() => {
    $('.timer').html(`<b>${timer}</b>`);

    // eslint-disable-next-line no-plusplus
    if (--timer < 0) {
      window.location = '/';
      clearInterval(end);
    }
  }, 1000);
};

$(window).on('load', () => {
  initMenu();
  setCopyrightDate();
  startTimer();
});
