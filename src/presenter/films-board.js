import { render, remove } from '../utils/render';
import { RenderPosition, SITE_MAIN } from '../utils/constants';

import FilmsView from '../view/films';

import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import FilmView from '../view/film';
import LoadMoreButtonView from '../view/loadMoreButton';

export default class FilmsBoardPresenter {
  constructor() {
    // this._filmsBoardContainer = filmsBoardContainer;

    this.filmsArray = [];
    this.commentsArray = [];

    this.siteFilmsView = new FilmsView();
    this.filmsListView = new FilmsListView(Boolean(this.filmsArray));
    this.filmsListTopView = new FilmsListTopView();
    this.filmsListCommentedView = new FilmsListCommentedView();
  }

  init(filmsArray, commentsArray) {
    this.filmsArray = [...filmsArray];
    this.commentsArray = [...commentsArray];

    render(SITE_MAIN, this.siteFilmsView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListTopView, RenderPosition.BEFOREEND);
    render(this.siteFilmsView, this.filmsListCommentedView, RenderPosition.BEFOREEND);

    this._renderFilmsBoard();
  }

  _renderSort() {
    // Метод для рендеринга сортировки
  }

  _renderFilm() {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  _renderFilms() {
    // Метод для рендеринга N-задач за раз
  }

  _renderNoFilms() {
    // Метод для рендеринга заглушки
  }

  _renderLoadMoreButton() {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  _renderFilmsBoard() {

    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }
}
