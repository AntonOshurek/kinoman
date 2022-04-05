import { render, remove } from './utils/render';
import { RenderPosition, SITE_BODY, SITE_HEADER, SITE_MAIN, SITE_FOOTER_STATISTICS } from './utils/constants';
import { sortFilmsByField, onEscKeyDown } from './utils/common';
import { FILMS_COUNT, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILMS_COUNT_PER_STEP, SORT_FIELDS } from './utils/constants';

//main views
import ProfileView from './view/profile';
import NavigationView from './view/navigation';
import SortView from './view/sort';
import FilmsView from './view/films'; //~!!!
import FooterView from './view/footer';
//films views
import FilmsListView from './view/films-list';  //~!!!
import FilmsListTopView from './view/films-list-top'; //~!!!
import FilmsListCommentedView from './view/films-list-commented'; //~!!!
import FilmView from './view/film'; //~!!!
import LoadMoreButtonView from './view/loadMoreButton'; //~!!!
//popup view
import PopupView from './view/popup';
//get data
import { generateFilm, commentsArray } from './mock/mock';

//Get and Transfom DATA
const defaultFilmsArray = Array.from({length: FILMS_COUNT}, generateFilm);
let sortFilmsArray = defaultFilmsArray;

const filmsCount = +defaultFilmsArray.length;

//show header block
render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);
render(SITE_MAIN, new NavigationView(), RenderPosition.BEFOREEND);
const sortComponent = new SortView();
render(SITE_MAIN, sortComponent, RenderPosition.BEFOREEND);

//show films block
const siteFilmsView = new FilmsView();
render(SITE_MAIN, siteFilmsView, RenderPosition.BEFOREEND);

const filmsListView = new FilmsListView(Boolean(filmsCount));
render(siteFilmsView, filmsListView, RenderPosition.BEFOREEND);

const filmsListTopView = new FilmsListTopView();
render(siteFilmsView, filmsListTopView, RenderPosition.BEFOREEND);

const filmsListCommentedView = new FilmsListCommentedView();
render(siteFilmsView, filmsListCommentedView, RenderPosition.BEFOREEND);

//show footer block
render(SITE_FOOTER_STATISTICS, new FooterView(filmsCount), RenderPosition.BEFOREEND);

//show ALL films logick
const siteFilmsListContainer = filmsListView.getElement().querySelector('.films-list__container--main');
const siteTopFilmContainer = filmsListTopView.getElement().querySelector('.films-list__container--top');
const siteCommentedFilmContainer = filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

const showTopFilms = () => {
  //show top films list
  const topFilmsArray = sortFilmsByField(defaultFilmsArray, SORT_FIELDS.RATING, COMMENTED_FILMS_COUNT);
  for (let i = 0; i < TOP_FILMS_COUNT; i++) {
    render(siteTopFilmContainer, new FilmView(topFilmsArray[i]), RenderPosition.BEFOREEND);
  }

  //show commented films list
  const commentedFilmsArray = sortFilmsByField(defaultFilmsArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
  for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
    render(siteCommentedFilmContainer, new FilmView(commentedFilmsArray[i]), RenderPosition.BEFOREEND);
  }
};
showTopFilms(); //call for this function on first launch

//show main films list
const showMainFilmsList = (data) => {
  if(filmsCount) {
    for (let i = 0; i < Math.min(data.length, FILMS_COUNT_PER_STEP); i++) {
      render(siteFilmsListContainer, new FilmView(data[i]), RenderPosition.BEFOREEND);
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

//show popup logick
let popupComponent = null;

function closePopup() {
  SITE_BODY.classList.remove('hide-overflow');
  remove(popupComponent);
  popupComponent = null;
  document.removeEventListener('keydown', onEscKeyDown);
  siteFilmsView.setOpenPopupClikHandler(openPopup);
}

function openPopup(evt) {
  if(evt.target.closest('.film-card')) {
    //search current film
    const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
    const currentFilm = defaultFilmsArray.find((film) => film.id === filmUNID);
    //generate popup markup
    popupComponent = new PopupView(currentFilm, commentsArray);
    //show popup
    render(SITE_MAIN, popupComponent, RenderPosition.BEFOREEND);

    SITE_BODY.classList.add('hide-overflow'); //hide scroll
    siteFilmsView.removeOpenPopupClikHandler();
    //listeners for closed popup
    popupComponent.setClosePopupButtonClickHandler(closePopup);
    document.addEventListener('keydown', () => onEscKeyDown(evt, closePopup()));
  }
}
siteFilmsView.setOpenPopupClikHandler(openPopup);

//load more films logik
const loadMoreButton = new LoadMoreButtonView();
function mainFilmsPagination() {
  if(sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
    let renderedTaskCount = FILMS_COUNT_PER_STEP;

    loadMoreButton.getElement() ? render(filmsListView, loadMoreButton.getElement(), RenderPosition.BEFOREEND) : null;

    loadMoreButton.setPaginationClickHandler(() => {
      sortFilmsArray
        .slice(renderedTaskCount, renderedTaskCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => render(siteFilmsListContainer, new FilmView(film), RenderPosition.BEFOREEND));

      renderedTaskCount += FILMS_COUNT_PER_STEP;

      if (renderedTaskCount >= sortFilmsArray.length) {
        remove(loadMoreButton);
      }
    });
  }
}
mainFilmsPagination();
