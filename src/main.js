import { render } from './services/render';

//views
import { createFooterTemplate } from './view/footer';
import { createProfileTemplate } from './view/profile';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';
import { createFilmsTemplate } from './view/films';

import { createFilmsListTemplate } from './view/films-list';
import { createFilmsListTopTemplate } from './view/films-list-top';
import { createFilmsListCommentedTemplate } from './view/films-list-commented';
import { createFilmTemplate } from './view/film';
import { createLoadMoreButton } from './view/loadMoreButton';

import { generateFilm } from './mock/mock';

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

//header block
render(siteHeader, createProfileTemplate(), 'beforeend');
render(siteMain, createNavigationTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');

//films block
const siteFilms = document.querySelector('.films');

render(siteFilms, createFilmsListTemplate(), 'beforeend');
render(siteFilms, createFilmsListTopTemplate(), 'beforeend');
render(siteFilms, createFilmsListCommentedTemplate(), 'beforeend');


const FILMS_COUNT = 12;
const FILMS_COUNT_PER_STEP = 5;
const filmsArray = Array.from({length: FILMS_COUNT}, generateFilm);
const siteFilmsList = document.querySelector('.films-list');
const siteFilmsListContainer = document.querySelector('.films-list__container');

for (let i = 0; i < Math.min(filmsArray.length, FILMS_COUNT_PER_STEP); i++) {
  render(siteFilmsListContainer, createFilmTemplate(filmsArray[i]), 'beforeend');
}

if (filmsArray.length > FILMS_COUNT_PER_STEP) {
  let renderedTaskCount = FILMS_COUNT_PER_STEP;

  render(siteFilmsList, createLoadMoreButton(), 'beforeend');

  const loadMoreButton = document.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmsArray
      .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(siteFilmsListContainer, createFilmTemplate(film), 'beforeend'));

    renderedTaskCount += FILMS_COUNT_PER_STEP;

    if (renderedTaskCount >= filmsArray.length) {
      loadMoreButton.remove();
    }
  });
}


// footer block
render(siteFooterStatistics, createFooterTemplate(), 'beforeend');
