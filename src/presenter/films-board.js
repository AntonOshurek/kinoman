import { render, remove } from '../utils/render';
import { sortFilmsByField, updateItem } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILM_TYPE, MENU_FIELDS } from '../utils/constants';

import SortView from '../view/sort';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import LoadMoreButtonView from '../view/loadMoreButton';
import FilmsListTitleView from '../view/filmsListTitle';

import PopupPresenter from './popup-presenter';
import FilmPresenter from './film-presenter';
import NavigationPresenter from './navigation-presenter';

export default class FilmsBoardPresenter {
  constructor() {
    this._sourceDataArray = [];
    this._sourceCommentsArray = [];
    //data variables for using
    this._defaultFilmsArray = [];
    this._sortFilmsArray = [];
    //basic variables
    this._renderedTaskCount = null;
    this._currentFilter = null;
    this._currentMenu = null;
    this._currentMenuData = null;
    // films presenters arrays
    this._mainFilmPresenters = new Map();
    this._topFilmPresenters = new Map();
    this._commentedFilmPresenters = new Map();
    //views
    this._sortFilmsView = new SortView();
    this._siteFilmsView = new FilmsView();
    this._filmsListView = new FilmsListView();
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
    this._loadMoreButtonView = new LoadMoreButtonView();
    this._FilmsListTitleView = null;
    //binding
    this._showFilmsListByCurrentMenu = this._showFilmsListByCurrentMenu.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._setpopupStatus = this._setpopupStatus.bind(this);
    //presenters
    this._PopupPresenter = new PopupPresenter(this._handleFilmChange, this._setpopupStatus);
    this._navigationPresenter = new NavigationPresenter(this._showFilmsListByCurrentMenu);
  }

  init(filmsData, commentsData) {
    this._sourceDataArray = [...filmsData];
    this._sourceCommentsArray = [...commentsData];
    this._defaultFilmsArray = filmsData;
    //sort data
    this._sortFilmsArray = filmsData;
    this._currentSortField = SORT_FIELDS.DEFAULT;
    //menu data
    this._currentMenuData = filmsData;
    this._currentMenuField = MENU_FIELDS.ALL;
    //popup data
    this._popupFilmUNID = null;
    this._popupFilmData = null;
    this._popupFilmComments = null;
    this._popupStatus = false;

    this._navigationPresenter.init(this._sortFilmsArray);
    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREEND);
    render(SITE_MAIN, this._siteFilmsView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    this._sortFilmsView.setSortClickHandler(this._handleSortTypeChange);
    this._siteFilmsView.setOpenPopupClikHandler(this._openPopupClickHandler);

    this._renderFilmsBoard();
    this._sourceDataArray.length > 0 ? this._renderTopFilms() : null;
  }

  _searchFilmDataForPopup() {
    if(this._popupFilmUNID) {
      const foo = this._sortFilmsArray.find((film) => film.id === this._popupFilmUNID);
      this._popupFilmData = foo;
      this._popupFilmComments = this._popupFilmData.comments.map((commentID) => this._sourceCommentsArray.find((com) => (com.id === commentID)));
    }
  }

  _setpopupStatus(status) {
    this._popupStatus = status;
  }

  _openPopupClickHandler(filmUNID) {
    this._popupFilmUNID = filmUNID;
    this._searchFilmDataForPopup();
    this._PopupPresenter.init(this._popupFilmData, this._popupFilmComments);
  }

  _showFilmsListByCurrentMenu(sortData, currentMenu) {
    this._currentMenuField = currentMenu;
    this._currentMenuData = sortData;
    this._sortFilmsArray = sortData;
    this._resetSort();
    this._renderFilmsBoard();
  }

  _clearMainFilmsList() {
    this._mainFilmPresenters.forEach((film) => film.destroy());
    this._mainFilmPresenters.clear();
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;
  }

  _handleFilmChange(updatedFilm) {
    this._defaultFilmsArray = updateItem(this._defaultFilmsArray, updatedFilm);
    this._sortFilmsArray = this._defaultFilmsArray;
    this._mainFilmPresenters.get(updatedFilm.id) ? this._mainFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
    this._topFilmPresenters.get(updatedFilm.id) ? this._topFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
    this._commentedFilmPresenters.get(updatedFilm.id) ? this._commentedFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;

    this._navigationPresenter.init(this._sortFilmsArray);
    if(this._popupStatus) {
      this._searchFilmDataForPopup();
      this._PopupPresenter.init(this._popupFilmData, this._popupFilmComments);
    }
  }

  _sortFilms() {
    if(this._currentSortField === SORT_FIELDS.DEFAULT) {
      this._currentMenuField === MENU_FIELDS.ALL ? this._sortFilmsArray = this._defaultFilmsArray : this._sortFilmsArray = this._currentMenuData;
    } else {
      this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, this._currentSortField);
    }
  }

  _handleSortTypeChange(sortField) {
    if(sortField !== this._currentSortField) {
      this._currentSortField = sortField;
      this._sortFilms();
      this._renderFilmsBoard();
    }
  }

  _resetSort() {
    this._sortFilmsView.resetSort();
    this._currentSortField = SORT_FIELDS.DEFAULT;
  }

  _renderTopFilms() {
    const topFilmsArray = sortFilmsByField(this._sourceDataArray, SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    topFilmsArray.map((film) => this._renderFilm(film, this._siteTopFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.TOP));

    const commentedFilmsArray = sortFilmsByField(this._sourceDataArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    commentedFilmsArray.map((film) => this._renderFilm(film, this._siteCommentedFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.COMMENTED));
  }

  _renderNoFilms() {
    this._FilmsListTitleView ? remove(this._FilmsListTitleView) : null;
    this._clearMainFilmsList();
    this._FilmsListTitleView = new FilmsListTitleView(this._currentMenu);
    render(this._siteFilmsListContainer, this._FilmsListTitleView, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, place, position, filmType = FILM_TYPE.MAIN) {
    const oneFilmPresenter = new FilmPresenter(position, place, this._handleFilmChange);
    oneFilmPresenter.init(film);

    filmType === FILM_TYPE.MAIN ? this._mainFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.TOP ? this._topFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.COMMENTED ? this._commentedFilmPresenters.set(film.id, oneFilmPresenter) : null;
  }

  _renderFilms(from, to) {
    this._sortFilmsArray
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, this._siteFilmsListContainer, RenderPosition.BEFOREEND));
  }

  _renderLoadMoreButton() {
    this._loadMoreButtonView.getElement() ? render(this._filmsListView, this._loadMoreButtonView, RenderPosition.BEFOREEND) : null;

    this._loadMoreButtonView.setPaginationClickHandler(() => {
      this._renderFilms(this._renderedTaskCount, this._renderedTaskCount + FILMS_COUNT_PER_STEP);
      this._renderedTaskCount += FILMS_COUNT_PER_STEP;
      this._renderedTaskCount >= this._sortFilmsArray.length ? remove(this._loadMoreButtonView) : null;
    });
  }

  _renderFilmsBoard() {
    if (this._sortFilmsArray.length === 0) {
      this._renderNoFilms();
      return;
    }
    this._FilmsListTitleView === null ? null : remove(this._FilmsListTitleView);

    if(this._sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
      this._renderedTaskCount = FILMS_COUNT_PER_STEP;
    } else {
      remove(this._loadMoreButtonView);
    }

    this._mainFilmPresenters.size === 0 ? null : this._clearMainFilmsList();
    this._renderFilms(0, Math.min(this._sortFilmsArray.length, FILMS_COUNT_PER_STEP));
  }
}
