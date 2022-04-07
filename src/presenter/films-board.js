import { render, remove } from '../utils/render';
import { sortFilmsByField } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT } from '../utils/constants';

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
    this.renderedTaskCount = null;

    this._siteFilmsView = new FilmsView();
    this._filmsListView = new FilmsListView(Boolean(this.filmsArray));
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
  }

  init(filmsArray, commentsArray) {
    this._filmsArray = [...filmsArray];
    this._commentsArray = [...commentsArray];
    this._sortFilmsArray = filmsArray;
    this.renderedTaskCount = FILMS_COUNT_PER_STEP;

    render(SITE_MAIN, this._siteFilmsView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    this._loadMoreButton = new LoadMoreButtonView();
    this._PopupPresenter = new PopupPresenter();

    this._renderFilmsBoard();
    this._popup();
  }

  _renderSort() {

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

  _popup() {
    this._PopupPresenter.init(this._filmsArray, this._commentsArray, this._siteFilmsView);
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    this._loadMoreButton.getElement() ? render(this._filmsListView, this._loadMoreButton.getElement(), RenderPosition.BEFOREEND) : null;

    this._loadMoreButton.setPaginationClickHandler(() => {
      this._renderFilms(this.renderedTaskCount, this.renderedTaskCount + FILMS_COUNT_PER_STEP);

      this.renderedTaskCount += FILMS_COUNT_PER_STEP;

      if (this.renderedTaskCount >= this._sortFilmsArray.length) {
        remove(this._loadMoreButton);
      }
    });
  }

  _renderFilmsBoard() {
    if (this._filmsArray.length === 0) {
      this._renderNoFilms();
      return;
    }

    if(this._sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }

    this._renderFilms(0, Math.min(this._sortFilmsArray.length, FILMS_COUNT_PER_STEP));
    this._showTopFilms();
  }
}
