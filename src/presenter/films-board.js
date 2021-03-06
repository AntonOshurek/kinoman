import { render, remove } from '../utils/render';
import { sortFilmsByField, filter } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILM_TYPE, NAVIGATION_FIELDS, UPDATE_TYPE } from '../utils/constants';

import SortView from '../view/sort';
import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import LoadMoreButtonView from '../view/loadMoreButton';
import FilmsListTitleView from '../view/filmsListTitle';
import Stats from '../view/stats';
import FilmPresenter from './film-presenter';

export default class FilmsBoardPresenter {
  constructor(filmsModel, navigationModel, commentsModel, siteFilmsView) {
    this._filmsModel = filmsModel;
    this._navigationModel = navigationModel;
    this._commentsModel = commentsModel;
    this._renderedFilmsCount = null;
    // films presenters arrays
    this._mainFilmPresenters = new Map();
    this._topFilmPresenters = new Map();
    this._commentedFilmPresenters = new Map();
    //views
    this._siteFilmsView = siteFilmsView;
    this._filmsListView = new FilmsListView();
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
    this._loadMoreButtonView = new LoadMoreButtonView();
    this._statsView = new Stats();
    this._FilmsListTitleView = null;
    //binding
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._currentSortField = SORT_FIELDS.DEFAULT;
    this._prevMenuField = NAVIGATION_FIELDS.ALL;

    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    //observers
    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._navigationModel.addObserver(this._handleModelEvent);

    this._renderFilmsBoard();
    this._filmsModel.getFilms().length >= 2 ? this._renderTopFilms() : null;
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._navigationModel.getNavigationField()](films);

    if(this._currentSortField === SORT_FIELDS.DEFAULT) {
      return filtredFilms;
    } else {
      return sortFilmsByField(filtredFilms, this._currentSortField);
    }
  }

  _handleFilmAction(update) {
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, update);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.CHANGE_FILM_DATA:
        this._mainFilmPresenters.get(data.id) ? this._mainFilmPresenters.get(data.id).init(data) : null;
        this._topFilmPresenters.get(data.id) ? this._topFilmPresenters.get(data.id).init(data) : null;
        this._commentedFilmPresenters.get(data.id) ? this._commentedFilmPresenters.get(data.id).init(data) : null;

        if(this._navigationModel.getNavigationField() !== NAVIGATION_FIELDS.ALL) {
          this._clearFilmsBoard({resetRenderedFilmsCount: true});
          this._renderFilmsBoard();
        }
        break;
      case UPDATE_TYPE.ADD_COMMENT:
        this._clearTopFilms();
        this._renderTopFilms();
        break;
      case UPDATE_TYPE.DELETE_COMMENT:
        this._clearTopFilms();
        this._renderTopFilms();
        break;
      case UPDATE_TYPE.NAVIGATION:
        if(data === NAVIGATION_FIELDS.STATS) {
          this.destroy();
          render(this._siteFilmsView, this._statsView, RenderPosition.BEFOREEND);
        } else if(this._prevMenuField === NAVIGATION_FIELDS.STATS) {
          remove(this._statsView);
          this.init();
        } else {
          this._clearFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});
          this._renderFilmsBoard();
        }
        this._prevMenuField = data;
        break;
      case UPDATE_TYPE.INIT:
        this.init();
    }
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});

    this._sortFilmsView ? remove(this._sortFilmsView) : null;
    remove(this._filmsListView);
    remove(this._filmsListTopView);
    remove(this._filmsListCommentedView);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _handleSortTypeChange(sortField) {
    if(sortField !== this._currentSortField) {
      this._currentSortField = sortField;
      this._clearFilmsBoard({resetRenderedFilmsCount: true});
      this._renderFilmsBoard();
    }
  }

  _renderSort() {
    this._sortFilmsView = new SortView(this._currentSortField);
    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREBEGIN);

    this._sortFilmsView.setSortClickHandler(this._handleSortTypeChange);
  }

  _renderTopFilms() {
    const topFilmsArray = sortFilmsByField(this._filmsModel.getFilms(), SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    topFilmsArray.map((film) => this._renderFilm(film, this._siteTopFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.TOP));

    const commentedFilmsArray = sortFilmsByField(this._filmsModel.getFilms(), SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    commentedFilmsArray.map((film) => this._renderFilm(film, this._siteCommentedFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.COMMENTED));
  }

  _renderNoFilms() {
    this._FilmsListTitleView ? remove(this._FilmsListTitleView) : null;
    this._clearFilmsBoard();
    this._FilmsListTitleView = new FilmsListTitleView(this._currentMenu);
    render(this._siteFilmsListContainer, this._FilmsListTitleView, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, place, position, filmType = FILM_TYPE.MAIN) {
    const oneFilmPresenter = new FilmPresenter(position, place, this._handleFilmAction);
    oneFilmPresenter.init(film);

    filmType === FILM_TYPE.MAIN ? this._mainFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.TOP ? this._topFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.COMMENTED ? this._commentedFilmPresenters.set(film.id, oneFilmPresenter) : null;
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._siteFilmsListContainer, RenderPosition.BEFOREEND));
  }

  _renderLoadMoreButton() {
    this._loadMoreButtonView.getElement() ? render(this._filmsListView, this._loadMoreButtonView, RenderPosition.BEFOREEND) : null;

    this._loadMoreButtonView.setPaginationClickHandler(() => {
      const filmsArray = this._getFilms();
      const films = filmsArray.slice(this._renderedFilmsCount, Math.min(filmsArray.length, this._renderedFilmsCount + FILMS_COUNT_PER_STEP));
      this._renderFilms(films);

      this._renderedFilmsCount += FILMS_COUNT_PER_STEP;
      this._renderedFilmsCount >= filmsArray.length ? remove(this._loadMoreButtonView) : null;
    });
  }

  _clearTopFilms() {
    this._topFilmPresenters.forEach((film) => film.destroy());
    this._commentedFilmPresenters.forEach((film) => film.destroy());
  }

  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    this._mainFilmPresenters.forEach((film) => film.destroy());
    this._mainFilmPresenters.clear();

    this._sortFilmsView ? remove(this._sortFilmsView) : null;
    remove(this._loadMoreButtonView);

    if (this._FilmsListTitleView) {
      remove(this._FilmsListTitleView);
    }

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(this._getFilms().length, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortField = SORT_FIELDS.DEFAULT;
    }
  }

  _renderFilmsBoard() {
    const films = this._getFilms();

    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(films.length, this._renderedFilmsCount)));
    films.length > this._renderedFilmsCount ? this._renderLoadMoreButton() : null;
  }
}
