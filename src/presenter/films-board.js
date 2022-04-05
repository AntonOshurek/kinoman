import FilmsView from '../view/films';

import FilmsListView from './view/films-list';
import FilmsListTopView from './view/films-list-top';
import FilmsListCommentedView from './view/films-list-commented';
import FilmView from './view/film';
import LoadMoreButtonView from './view/loadMoreButton';

export default class FilmsBoardPresenter {
  constructor(filmsBoardContainer) {
    this._filmsBoardContainer = filmsBoardContainer;
  }

  init(filmsArray) {
    // this._boardTasks = [...boardTasks];
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
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
