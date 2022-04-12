import { render, remove } from '../utils/render';
import { sortFilmsByField, updateItem } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT } from '../utils/constants';

import SortView from '../view/sort';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import LoadMoreButtonView from '../view/loadMoreButton';

import PopupPresenter from './popup-presenter';
import FilmPresenter from './film-presenter';
import NavigationPresenter from './navigation-presenter';

export default class FilmsBoardPresenter {
  constructor() {
    this._filmsArray = [];
    this._commentsArray = [];
    this._defaultFilmsArray = [];
    this._sortFilmsArray = [];
    this._renderedTaskCount = null;
    this._currentFilmFilter = null;
    this._mainFilmPresenters = new Map();
    this._topFilmPresenters = new Map();
    this._commentedFilmPresenters = new Map();

    this._sortFilmsView = new SortView();
    this._siteFilmsView = new FilmsView();
    this._filmsListView = new FilmsListView(Boolean(this.filmsArray));
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
    this._loadMoreButton = new LoadMoreButtonView();
    this._PopupPresenter = null;

    this._initNewWachList = this._initNewWachList.bind(this);
    this._navigationPresenter = new NavigationPresenter(this._initNewWachList);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(filmsArray, commentsArray) {
    this._filmsArray = [...filmsArray];
    this._commentsArray = [...commentsArray];
    this._defaultFilmsArray = filmsArray;
    this._sortFilmsArray = filmsArray;
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;
    this._currentFilmFilter = SORT_FIELDS.DEFAULT;

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
    this._showTopFilms();
    this._initPopup();
  }

  _initNewWachList(sortData) {
    this._defaultFilmsArray = sortData;
    this._sortFilmsView.resetSort();
    this._currentFilmFilter = SORT_FIELDS.DEFAULT;
    this._sortFilmsArray = this._defaultFilmsArray;
    this._renderFilmsBoard();
  }

  _clearFilmsList() { // ????????????????????
    this._filmPresenters.forEach((film) => film.destroy());
    this._filmPresenters.clear();
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;
  }

  _removeAllFilmsInBoard() {this._siteFilmsListContainer.querySelectorAll('.film-card').forEach((item) => item.remove());}

  _sortFilms(filter) {
    if(filter === SORT_FIELDS.DEFAULT && this._currentFilmFilter !== filter) {
      this._sortFilmsArray = this._defaultFilmsArray;
    }
    if(filter === SORT_FIELDS.DATE && this._currentFilmFilter !== filter) {
      this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.DATE);
    }
    if(filter === SORT_FIELDS.RATING && this._currentFilmFilter !== filter) {
      this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.RATING);
    }
  }

  _handleSortTypeChange(filter) {
    if(filter === this._currentFilmFilter) {
      return;
    }
    this._sortFilms(filter);
    this._currentFilmFilter = filter;
    this._renderFilmsBoard();
  }

  _renderSort() {
    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREEND);
    this._sortFilmsView.setSortClickHandler(this._handleSortTypeChange);
  }

  _handleFilmChange(updatedFilm) {
    this._defaultFilmsArray = updateItem(this._defaultFilmsArray, updatedFilm);
    this._sortFilmsArray = this._defaultFilmsArray;
    this._mainFilmPresenters.get(updatedFilm.id).init(updatedFilm);
    this._topFilmPresenters.get(updatedFilm.id).init(updatedFilm);
    this._commentedFilmPresenters.get(updatedFilm.id).init(updatedFilm);

    this._navigationPresenter.init(this._sortFilmsArray);
    this._PopupPresenter.init(this._sortFilmsArray, this._commentsArray);
  }

  _renderFilm(film, place, position, filmType = 'main') {
    const filmPresenter = new FilmPresenter(position, place, this._handleFilmChange);
    filmPresenter.init(film);

    if(filmType === 'main') {
      this._mainFilmPresenters.set(film.id, filmPresenter);
    }
    if(filmType === 'top') {
      this._topFilmPresenters.set(film.id, filmPresenter);
    }
    if(filmType === 'commented') {
      this._commentedFilmPresenters.set(film.id, filmPresenter);
    }
  }

  _renderFilms(from, to) {
    this._sortFilmsArray
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, this._siteFilmsListContainer, RenderPosition.BEFOREEND));
  }

  _showTopFilms() {
    const topFilmsArray = sortFilmsByField(this._filmsArray, SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    for (let i = 0; i < TOP_FILMS_COUNT; i++) {
      this._renderFilm(topFilmsArray[i], this._siteTopFilmContainer, RenderPosition.BEFOREEND, 'top');
    }

    const commentedFilmsArray = sortFilmsByField(this._filmsArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
      this._renderFilm(commentedFilmsArray[i], this._siteCommentedFilmContainer, RenderPosition.BEFOREEND, 'commented');
    }
  }

  _initPopup() {
    this._PopupPresenter = new PopupPresenter(this._handleFilmChange, this._siteFilmsView);
    this._PopupPresenter.init(this._filmsArray, this._commentsArray);
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    this._loadMoreButton.getElement() ? render(this._filmsListView, this._loadMoreButton, RenderPosition.BEFOREEND) : null;

    this._loadMoreButton.setPaginationClickHandler(() => {
      this._renderFilms(this._renderedTaskCount, this._renderedTaskCount + FILMS_COUNT_PER_STEP);

      this._renderedTaskCount += FILMS_COUNT_PER_STEP;

      if (this._renderedTaskCount >= this._sortFilmsArray.length) {
        remove(this._loadMoreButton);
      }
    });
  }

  _renderFilmsBoard() {
    if (this._sortFilmsArray.length === 0) {
      this._renderNoFilms();
      return;
    }

    if(this._sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
      this._renderedTaskCount = FILMS_COUNT_PER_STEP;
    }
    this._removeAllFilmsInBoard();
    this._renderFilms(0, Math.min(this._sortFilmsArray.length, FILMS_COUNT_PER_STEP));
  }
}
