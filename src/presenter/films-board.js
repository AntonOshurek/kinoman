import { render, remove } from '../utils/render';
import { sortFilmsByField, updateItem } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILM_TYPE } from '../utils/constants';

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
    //presenters
    this._PopupPresenter = null;
    this._navigationPresenter = new NavigationPresenter(this._showFilmsListByCurrentMenu);
  }

  init(filmsData, commentsData) {
    this._sourceDataArray = [...filmsData];
    this._sourceCommentsArray = [...commentsData];
    this._defaultFilmsArray = filmsData;
    this._sortFilmsArray = filmsData;
    this._currentMenu = 'all';
    this._currentMenuData = filmsData;
    this._currentFilter = SORT_FIELDS.DEFAULT;

    this._renderSort();
    this._navigationPresenter.init(this._sortFilmsArray);
    render(SITE_MAIN, this._siteFilmsView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    this._renderFilmsBoard();
    this._sourceDataArray.length > 0 ? this._showTopFilms() : null;
    this._initPopup();
  }

  _showFilmsListByCurrentMenu(sortData, currentMenu) {
    this._currentMenu = currentMenu;
    this._currentMenuData = sortData;
    this._sortFilmsArray = sortData;
    this._resetSort();
    this._renderFilmsBoard();
  }

  _resetSort() {
    this._sortFilmsView.resetSort();
    this._currentFilter = SORT_FIELDS.DEFAULT;
  }

  _clearMainFilmsList() {
    this._mainFilmPresenters.forEach((film) => film.destroy());
    this._mainFilmPresenters.clear();
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;
  }

  _sortFilms(filter) {
    if(filter === SORT_FIELDS.DEFAULT) {
      this._currentMenu === 'all' ? this._sortFilmsArray = this._defaultFilmsArray : this._sortFilmsArray = this._currentMenuData;
    }
    if(filter === SORT_FIELDS.DATE) {
      this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.DATE);
    }
    if(filter === SORT_FIELDS.RATING) {
      this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.RATING);
    }
  }

  _handleSortTypeChange(filter) {
    if(filter !== this._currentFilter) {
      this._sortFilms(filter);
      this._currentFilter = filter;
      this._renderFilmsBoard();
    }
  }

  _renderSort() {
    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREEND);
    this._sortFilmsView.setSortClickHandler(this._handleSortTypeChange);
  }

  _handleFilmChange(updatedFilm) {
    this._defaultFilmsArray = updateItem(this._defaultFilmsArray, updatedFilm);
    this._sortFilmsArray = updateItem(this._defaultFilmsArray, updatedFilm);
    this._mainFilmPresenters.get(updatedFilm.id) ? this._mainFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
    this._topFilmPresenters.get(updatedFilm.id) ? this._topFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
    this._commentedFilmPresenters.get(updatedFilm.id) ? this._commentedFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;

    this._navigationPresenter.init(this._defaultFilmsArray);
    this._PopupPresenter.init(this._defaultFilmsArray, this._sourceCommentsArray);
  }

  _showTopFilms() {
    const topFilmsArray = sortFilmsByField(this._sourceDataArray, SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    topFilmsArray.map((film) => this._renderFilm(film, this._siteTopFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.TOP));

    const commentedFilmsArray = sortFilmsByField(this._sourceDataArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    commentedFilmsArray.map((film) => this._renderFilm(film, this._siteCommentedFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.COMMENTED));
  }

  _initPopup() {
    this._PopupPresenter = new PopupPresenter(this._handleFilmChange, this._siteFilmsView);
    this._PopupPresenter.init(this._sourceDataArray, this._sourceCommentsArray);
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
