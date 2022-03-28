import { render, renderElement, RenderPosition } from './services/render';
import { sortFilmsByField } from './utils/utils';

//main views
import { createFooterTemplate } from './view/footer';
// import { createProfileTemplate } from './view/profile';
import ProfileView from './view/profile';
import { createNavigationTemplate } from './view/navigation';
import SortView from './view/sort';
import { createFilmsTemplate } from './view/films';
//films views
import { createFilmsListTemplate } from './view/films-list';
import { createFilmsListTopTemplate } from './view/films-list-top';
import { createFilmsListCommentedTemplate } from './view/films-list-commented';
import { createFilmTemplate } from './view/film';
import { createLoadMoreButton } from './view/loadMoreButton';
//popup view
import { createpopupTemplate } from './view/popup';
//data
import { generateFilm, commentsArray } from './mock/mock';

const FILMS_COUNT = 20;
const COMMENTED_FILMS_COUNT = 2;
const TOP_FILMS_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

const defaultFilmsArray = Array.from({length: FILMS_COUNT}, generateFilm);
let sortFilmsArray = defaultFilmsArray;
const currentFilm = defaultFilmsArray[0];

const filmsCount = +defaultFilmsArray.length;

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

//show header block
renderElement(siteHeader, new ProfileView().element, RenderPosition.BEFOREEND);
render(siteMain, createNavigationTemplate(), 'beforeend');
renderElement(siteMain, new SortView().element, RenderPosition.BEFOREEND);

//show films block
render(siteMain, createFilmsTemplate(), 'beforeend');
const siteFilms = document.querySelector('.films');
render(siteFilms, createFilmsListTemplate(), 'beforeend');
render(siteFilms, createFilmsListTopTemplate(), 'beforeend');
render(siteFilms, createFilmsListCommentedTemplate(), 'beforeend');
//popup block
// render(siteMain, createpopupTemplate(currentFilm, commentsArray), 'beforeend');

// footer block
render(siteFooterStatistics, createFooterTemplate(filmsCount), 'beforeend');

//show ALL films logick
const siteFilmsList = document.querySelector('.films-list--main');
const siteFilmsListContainer = document.querySelector('.films-list__container--main');
const siteTopFilmContainer = document.querySelector('.films-list__container--top');
const siteCommentedFilmContainer = document.querySelector('.films-list__container--commented');

//show main films list
const showMainFilmsList = (data) => {
  for (let i = 0; i < Math.min(data.length, FILMS_COUNT_PER_STEP); i++) {
    render(siteFilmsListContainer, createFilmTemplate(data[i]), 'beforeend');
  }
};
showMainFilmsList(defaultFilmsArray); //call for this function on first launch

//sort logick
const sort = document.querySelector('.sort');

const addActiveClassForSortButton = (activeButton) => {
  const sortButton = document.querySelectorAll('.sort__button');
  sortButton.forEach((btn) => btn.classList.remove('sort__button--active'));
  activeButton.classList.add('sort__button--active');
};

sort.addEventListener('click', (evt) => {
  evt.preventDefault();
  const target = evt.target;

  const filmCard = siteFilmsListContainer.querySelectorAll('.film-card');

  if(target.classList.contains('sort__button--default')) {
    filmCard.forEach((item) => item.remove());   // delete all film-card
    addActiveClassForSortButton(target);
    sortFilmsArray = defaultFilmsArray;
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
  if(target.classList.contains('sort__button--date')) {
    filmCard.forEach((item) => item.remove());   // delete all film-card
    addActiveClassForSortButton(target);
    sortFilmsArray = sortFilmsByField(sortFilmsArray, 'date');
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
  if(target.classList.contains('sort__button--rating')) {
    filmCard.forEach((item) => item.remove());   // delete all film-card
    addActiveClassForSortButton(target);
    sortFilmsArray = sortFilmsByField(sortFilmsArray, 'total_rating');
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
});

//show top films list
const topFilmsArray = sortFilmsByField(defaultFilmsArray, 'total_rating', COMMENTED_FILMS_COUNT);
for (let i = 0; i < TOP_FILMS_COUNT; i++) {
  render(siteTopFilmContainer, createFilmTemplate(topFilmsArray[i]), 'beforeend');
}

//show commented films list
const commentedFilmsArray = sortFilmsByField(defaultFilmsArray, 'comments', COMMENTED_FILMS_COUNT);
for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
  render(siteCommentedFilmContainer, createFilmTemplate(commentedFilmsArray[i]), 'beforeend');
}

//show popup logick
function closePopup() {
  const losePopupButton = document.querySelector('.film-details__close-btn');
  losePopupButton.addEventListener('click', () => {
    document.querySelector('.film-details').remove();
    siteFilms.addEventListener('click', openPopup);
  });
}

function openPopup(evt) {
  if(evt.target.closest('.film-card')) {
    render(siteMain, createpopupTemplate(currentFilm, commentsArray), 'beforeend');
    siteFilms.removeEventListener('click', openPopup);
    closePopup();
  }
}

siteFilms.addEventListener('click', openPopup);

let renderedTaskCount;
let loadMoreButton;

const loadMoreFilms = (evt) => {
  evt.preventDefault();
  sortFilmsArray
    .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => render(siteFilmsListContainer, createFilmTemplate(film), 'beforeend'));

  renderedTaskCount += FILMS_COUNT_PER_STEP;

  if (renderedTaskCount >= sortFilmsArray.length) {
    loadMoreButton.removeEventListener('click', loadMoreFilms);
    loadMoreButton.remove();
  }
};

function mainFilmsPagination() {
  if(sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
    renderedTaskCount = FILMS_COUNT_PER_STEP;
    loadMoreButton ? loadMoreButton.remove() : null;
    render(siteFilmsList, createLoadMoreButton(), 'beforeend');

    loadMoreButton = document.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', loadMoreFilms);
  }
}

mainFilmsPagination();
