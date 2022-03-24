import { render } from './services/render';
import { sortFilmsByField } from './utils/utils';

//main views
import { createFooterTemplate } from './view/footer';
import { createProfileTemplate } from './view/profile';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';
import { createFilmsTemplate } from './view/films';
//films views
import { createFilmsListTemplate } from './view/films-list';
import { createFilmsListTopTemplate } from './view/films-list-top';
import { createFilmsListCommentedTemplate } from './view/films-list-commented';
import { createFilmTemplate } from './view/film';
import { createLoadMoreButton } from './view/loadMoreButton';
//data
import { generateFilm } from './mock/mock';

const FILMS_COUNT = 20;
const COMMENTED_FILMS_COUNT = 2;
const TOP_FILMS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const filmsArray = Array.from({length: FILMS_COUNT}, generateFilm);

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

//show header block
render(siteHeader, createProfileTemplate(), 'beforeend');
render(siteMain, createNavigationTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');

//show films block
const siteFilms = document.querySelector('.films');
render(siteFilms, createFilmsListTemplate(), 'beforeend');
render(siteFilms, createFilmsListTopTemplate(), 'beforeend');
render(siteFilms, createFilmsListCommentedTemplate(), 'beforeend');

// footer block
render(siteFooterStatistics, createFooterTemplate(+filmsArray.length), 'beforeend');

//show ALL films logick
const siteFilmsList = document.querySelector('.films-list--main');
const siteFilmsListContainer = document.querySelector('.films-list__container--main');
const siteTopFilmContainer = document.querySelector('.films-list__container--top');
const siteCommentedFilmContainer = document.querySelector('.films-list__container--commented');

//show main films list
for (let i = 0; i < Math.min(filmsArray.length, FILMS_COUNT_PER_STEP); i++) {
  render(siteFilmsListContainer, createFilmTemplate(filmsArray[i]), 'beforeend');
}

//show top films list
const topFilmsArray = sortFilmsByField(filmsArray, 'total_rating', COMMENTED_FILMS_COUNT);
for (let i = 0; i < TOP_FILMS_COUNT; i++) {
  render(siteTopFilmContainer, createFilmTemplate(topFilmsArray[i]), 'beforeend');
}

//show commented films list
const commentedFilmsArray = sortFilmsByField(filmsArray, 'comments', COMMENTED_FILMS_COUNT);
for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
  render(siteCommentedFilmContainer, createFilmTemplate(commentedFilmsArray[i]), 'beforeend');
}

//main films list pagination logick
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
