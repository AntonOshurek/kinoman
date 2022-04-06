import { render } from '../utils/render';
import { sortFilmsByField } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT } from '../utils/constants';

import FilmsView from '../view/films';

import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import FilmView from '../view/film';
// import LoadMoreButtonView from '../view/loadMoreButton';

export default class FilmsBoardPresenter {
  constructor() {
    // this._filmsBoardContainer = filmsBoardContainer;

    this.filmsArray = [];
    this.commentsArray = [];
    this.sortFilmsArray = [];

    this.siteFilmsView = new FilmsView();
    this.filmsListView = new FilmsListView(Boolean(this.filmsArray));
    this.filmsListTopView = new FilmsListTopView();
    this.filmsListCommentedView = new FilmsListCommentedView();
  }

  init(filmsArray, commentsArray) {
    this.filmsArray = [...filmsArray];
    this.commentsArray = [...commentsArray];
    this.sortFilmsArray = filmsArray;

    render(SITE_MAIN, this.siteFilmsView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListTopView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListCommentedView, RenderPosition.BEFOREEND);

    this._renderFilmsBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderFilm(film) {
    const siteFilmsListContainer = this.filmsListView.getElement().querySelector('.films-list__container--main');
    render(siteFilmsListContainer, new FilmView(film), RenderPosition.BEFOREEND);
  }

  _renderFilms(from, to) {
    this.sortFilmsArray
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _showTopFilms() {
    const siteTopFilmContainer = this.filmsListTopView.getElement().querySelector('.films-list__container--top');
    const topFilmsArray = sortFilmsByField(this.filmsArray, SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    for (let i = 0; i < TOP_FILMS_COUNT; i++) {
      render(siteTopFilmContainer, new FilmView(topFilmsArray[i]), RenderPosition.BEFOREEND);
    }

    const siteCommentedFilmContainer = this.filmsListCommentedView.getElement().querySelector('.films-list__container--commented');
    const commentedFilmsArray = sortFilmsByField(this.filmsArray, SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    for (let i = 0; i < COMMENTED_FILMS_COUNT; i++) {
      render(siteCommentedFilmContainer, new FilmView(commentedFilmsArray[i]), RenderPosition.BEFOREEND);
    }
  }

  _renderNoFilms() {
    console.log('no films');
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  _renderFilmsBoard() {
    if (this.filmsArray.length === 0) {
      this._renderNoFilms();
      return;
    }

    if(this.sortFilmsArray.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }

    this._renderFilms(0, Math.min(this.sortFilmsArray.length, FILMS_COUNT_PER_STEP));
    this._showTopFilms();
  }
}
