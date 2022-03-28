import { render, renderElement, RenderPosition } from './services/render';
import { sortFilmsByField } from './utils/utils';
import { FILMS_COUNT, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILMS_COUNT_PER_STEP } from './utils/variables';

//main views
import ProfileView from './view/profile';
import NavigationView from './view/navigation';
import SortView from './view/sort';
import FilmsView from './view/films';
import FooterView from './view/footer';
//films views
import FilmsList from './view/films-list';
import FilmsListTopView from './view/films-list-top';
import FilmsListCommentedView from './view/films-list-commented';
import FilmView from './view/film';
import LoadMoreButtonView from './view/loadMoreButton';
//popup view
import PopupView from './view/popup';
//get data
import { generateFilm, commentsArray } from './mock/mock';

//Get and Transfom DATA
const defaultFilmsArray = Array.from({length: FILMS_COUNT}, generateFilm);
let sortFilmsArray = defaultFilmsArray;
const currentFilm = defaultFilmsArray[0];

const filmsCount = +defaultFilmsArray.length;

//get containers for views
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooterStatistics = document.querySelector('.footer__statistics');

//show header block
renderElement(siteHeader, new ProfileView().element, RenderPosition.BEFOREEND);
renderElement(siteMain, new NavigationView().element, RenderPosition.BEFOREEND);
renderElement(siteMain, new SortView().element, RenderPosition.BEFOREEND);

//show films block
renderElement(siteMain, new FilmsView().element, RenderPosition.BEFOREEND);
const siteFilms = document.querySelector('.films');
renderElement(siteFilms, new FilmsList().element, RenderPosition.BEFOREEND);
renderElement(siteFilms, new FilmsListTopView().element, RenderPosition.BEFOREEND);
renderElement(siteFilms, new FilmsListCommentedView().element, RenderPosition.BEFOREEND);

//show footer block
renderElement(siteFooterStatistics, new FooterView(filmsCount).element, RenderPosition.BEFOREEND);

//show ALL films logick
const siteFilmsList = document.querySelector('.films-list--main');
const siteFilmsListContainer = document.querySelector('.films-list__container--main');
const siteTopFilmContainer = document.querySelector('.films-list__container--top');
const siteCommentedFilmContainer = document.querySelector('.films-list__container--commented');

//show main films list
const showMainFilmsList = (data) => {
  for (let i = 0; i < Math.min(data.length, FILMS_COUNT_PER_STEP); i++) {
    renderElement(siteFilmsListContainer, new FilmView(data[i]).element, RenderPosition.BEFOREEND);
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
  renderElement(siteTopFilmContainer, new FilmView(topFilmsArray[i]).element, RenderPosition.BEFOREEND);
}

//show commented films list
const commentedFilmsArray = sortFilmsByField(defaultFilmsArray, 'comments', COMMENTED_FILMS_COUNT);
for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
  renderElement(siteCommentedFilmContainer, new FilmView(commentedFilmsArray[i]).element, RenderPosition.BEFOREEND);
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
    // render(siteMain, createpopupTemplate(currentFilm, commentsArray), 'beforeend');
    renderElement(siteMain, new PopupView(currentFilm, commentsArray).element, RenderPosition.BEFOREEND);
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
    .forEach((film) => renderElement(siteFilmsListContainer, new FilmView(film).element, RenderPosition.BEFOREEND));

  renderedTaskCount += FILMS_COUNT_PER_STEP;

  if (renderedTaskCount >= sortFilmsArray.length) {
    loadMoreButton.removeEventListener('click', loadMoreFilms);
    loadMoreButton.remove();
  }
};

function mainFilmsPagination() {
  if(sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
    renderedTaskCount = FILMS_COUNT_PER_STEP;
    loadMoreButton ? loadMoreButton.removeElement : null;
    renderElement(siteFilmsList, new LoadMoreButtonView().element, RenderPosition.BEFOREEND);

    loadMoreButton = document.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', loadMoreFilms);
  }
}

mainFilmsPagination();
