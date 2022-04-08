import { render, remove } from '../utils/render';
import { sortFilmsByField } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT } from '../utils/constants';

import SortView from '../view/sort';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import LoadMoreButtonView from '../view/loadMoreButton';

import PopupPresenter from './popup-presenter';
import FilmPresenter from './film-presenter';

export default class FilmsBoardPresenter {
  constructor() {
    this._filmsArray = [];
    this._commentsArray = [];
    this._sortFilmsArray = [];
    this._renderedTaskCount = null;

    this._sortFilmsView = new SortView();
    this._siteFilmsView = new FilmsView();
    this._filmsListView = new FilmsListView(Boolean(this.filmsArray));
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
    this._loadMoreButton = new LoadMoreButtonView();
    this._PopupPresenter = new PopupPresenter();
  }

  init(filmsArray, commentsArray) {
    this._filmsArray = [...filmsArray];
    this._commentsArray = [...commentsArray];
    this._sortFilmsArray = filmsArray;
    this._renderedTaskCount = FILMS_COUNT_PER_STEP;

    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREEND);
    render(SITE_MAIN, this._siteFilmsView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    this._renderFilmsBoard(true);
    this._initPopup();
    this._sort();
  }

  _sort() {
    this._sortFilmsView.setSortClickHandler((evt) => {
      const target = evt.target;
      const filter = target.getAttribute('data-filter');
      const sortButton = this._sortFilmsView.getElement().querySelectorAll('.sort__button');

      const addActiveClassForSortButton = () => {
        sortButton.forEach((btn) => btn.classList.remove('sort__button--active'));
        target.classList.add('sort__button--active');
      };

      const removeAllFilms = () => {this._siteFilmsListContainer.querySelectorAll('.film-card').forEach((item) => item.remove());};

      if(filter === SORT_FIELDS.DEFAULT) {
        removeAllFilms();
        addActiveClassForSortButton();
        this._sortFilmsArray = this._filmsArray;
        this._renderFilmsBoard();
      }
      if(filter === SORT_FIELDS.DATE) {
        removeAllFilms();
        addActiveClassForSortButton();
        this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.DATE);
        this._renderFilmsBoard();
      }
      if(filter === SORT_FIELDS.RATING) {
        removeAllFilms();
        addActiveClassForSortButton();
        this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, SORT_FIELDS.RATING);
        this._renderFilmsBoard();
      }
    });
  }

  _renderFilm(film, place, position) {
    new FilmPresenter().init(film, position, place);
  }

  _renderFilms(from, to) {
    this._sortFilmsArray
      .slice(from, to)
      .forEach((film) => this._renderFilm(film, this._siteFilmsListContainer, RenderPosition.BEFOREEND));
  }

  _showTopFilms() {
    const topFilmsArray = sortFilmsByField(this._filmsArray, SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    for (let i = 0; i < TOP_FILMS_COUNT; i++) {
      this._renderFilm(topFilmsArray[i], this._siteTopFilmContainer, RenderPosition.BEFOREEND);
    }

    const commentedFilmsArray = sortFilmsByField(this._filmsArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
      this._renderFilm(commentedFilmsArray[i], this._siteCommentedFilmContainer, RenderPosition.BEFOREEND);
    }
  }

  _initPopup() {
    this._PopupPresenter.init(this._filmsArray, this._commentsArray, this._siteFilmsView);
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

  _renderFilmsBoard(showTopFilms = false) {
    if (this._filmsArray.length === 0) {
      this._renderNoFilms();
      return;
    }

    if(this._sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
      this._renderedTaskCount = FILMS_COUNT_PER_STEP;
    }

    this._renderFilms(0, Math.min(this._sortFilmsArray.length, FILMS_COUNT_PER_STEP));
    showTopFilms ? this._showTopFilms() : null;
  }
}
