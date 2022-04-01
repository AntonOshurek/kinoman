import { render } from './utils/render';
import { RenderPosition } from './utils/constants';
import { sortFilmsByField } from './utils/common';
import { FILMS_COUNT, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILMS_COUNT_PER_STEP, SORT_FIELDS } from './utils/constants';

//main views
import ProfileView from './view/profile';
import NavigationView from './view/navigation';
import SortView from './view/sort';
import FilmsView from './view/films';
import FooterView from './view/footer';
//films views
import FilmsListView from './view/films-list';
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

const filmsCount = +defaultFilmsArray.length;

//get containers for views
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');
const siteFooterStatistics = document.querySelector('.footer__statistics');

//show header block
render(siteHeader, new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new NavigationView().getElement(), RenderPosition.BEFOREEND);
const sortComponent = new SortView();
render(siteMain, sortComponent.getElement(), RenderPosition.BEFOREEND);

//show films block
const siteFilmsView = new FilmsView();
render(siteMain, siteFilmsView.getElement(), RenderPosition.BEFOREEND);
const siteFilms = siteFilmsView.getElement();
render(siteFilms, new FilmsListView(Boolean(filmsCount)).getElement(), RenderPosition.BEFOREEND);
render(siteFilms, new FilmsListTopView().getElement(), RenderPosition.BEFOREEND);
render(siteFilms, new FilmsListCommentedView().getElement(), RenderPosition.BEFOREEND);

//show footer block
render(siteFooterStatistics, new FooterView(filmsCount).getElement(), RenderPosition.BEFOREEND);

//show ALL films logick
const siteFilmsList = document.querySelector('.films-list--main');
const siteFilmsListContainer = document.querySelector('.films-list__container--main');
const siteTopFilmContainer = document.querySelector('.films-list__container--top');
const siteCommentedFilmContainer = document.querySelector('.films-list__container--commented');

const showTopFilms = () => {
  //show top films list
  const topFilmsArray = sortFilmsByField(defaultFilmsArray, SORT_FIELDS.RATING, COMMENTED_FILMS_COUNT);
  for (let i = 0; i < TOP_FILMS_COUNT; i++) {
    render(siteTopFilmContainer, new FilmView(topFilmsArray[i]).element, RenderPosition.BEFOREEND);
  }

  //show commented films list
  const commentedFilmsArray = sortFilmsByField(defaultFilmsArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
  for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
    render(siteCommentedFilmContainer, new FilmView(commentedFilmsArray[i]).element, RenderPosition.BEFOREEND);
  }
};
showTopFilms(); //call for this function on first launch

//show main films list
const showMainFilmsList = (data) => {
  if(filmsCount) {
    for (let i = 0; i < Math.min(data.length, FILMS_COUNT_PER_STEP); i++) {
      render(siteFilmsListContainer, new FilmView(data[i]).element, RenderPosition.BEFOREEND);
    }
  }

};
showMainFilmsList(defaultFilmsArray); //call for this function on first launch

//sort logick
sortComponent.setSortClickHandler((evt) => {
  const target = evt.target;
  const filter = target.getAttribute('data-filter');
  const sortButton = sortComponent.getElement().querySelectorAll('.sort__button');

  const addActiveClassForSortButton = () => {
    sortButton.forEach((btn) => btn.classList.remove('sort__button--active'));
    target.classList.add('sort__button--active');
  };

  const removeAllFilms = () => {siteFilmsListContainer.querySelectorAll('.film-card').forEach((item) => item.remove());};

  if(filter === SORT_FIELDS.DEFAULT) {
    removeAllFilms();
    addActiveClassForSortButton();
    sortFilmsArray = defaultFilmsArray;
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
  if(filter === SORT_FIELDS.DATE) {
    removeAllFilms();
    addActiveClassForSortButton();
    sortFilmsArray = sortFilmsByField(sortFilmsArray, SORT_FIELDS.DATE);
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
  if(filter === SORT_FIELDS.RATING) {
    removeAllFilms();
    addActiveClassForSortButton();
    sortFilmsArray = sortFilmsByField(sortFilmsArray, SORT_FIELDS.RATING);
    showMainFilmsList(sortFilmsArray);
    mainFilmsPagination();
  }
});

const siteBody = document.querySelector('.body');
//show popup logick
function closePopup() {
  siteBody.classList.remove('hide-overflow');
  document.querySelector('.film-details').remove();
  siteFilms.addEventListener('click', openPopup);
}

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

function openPopup(evt) {
  if(evt.target.closest('.film-card')) {
    //search current film
    const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
    const currentFilm = defaultFilmsArray.find((film) => film.id === filmUNID);
    //generate popup markup
    const popupComponent = new PopupView(currentFilm, commentsArray);
    //show popup
    render(siteMain, popupComponent.element, RenderPosition.BEFOREEND);

    siteBody.classList.add('hide-overflow'); //hide scroll
    siteFilms.removeEventListener('click', openPopup);
    //listeners for closed popup
    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
    });
    document.addEventListener('keydown', onEscKeyDown);
  }
}

siteFilms.addEventListener('click', openPopup);

//load more films logik
let renderedTaskCount;
let loadMoreButton;

const loadMoreFilms = (evt) => {
  evt.preventDefault();
  sortFilmsArray
    .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
    .forEach((film) => render(siteFilmsListContainer, new FilmView(film).element, RenderPosition.BEFOREEND));

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
    render(siteFilmsList, new LoadMoreButtonView().element, RenderPosition.BEFOREEND);

    loadMoreButton = document.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', loadMoreFilms);
  }
}

mainFilmsPagination();
