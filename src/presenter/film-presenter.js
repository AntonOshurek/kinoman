import FilmView from '../view/film';
import { render, remove } from '../utils/render';

export default class FilmPresenter {
  constructor() {
    this._filmView = null;
    this._filmData = null;
    this._renderPosition = null;
    this._renderPlace = null;
  }

  init(filmData, position, place) {
    this._filmData = filmData;
    this._filmView = new FilmView(this._filmData);
    this._renderPosition = position;
    this._renderPlace = place;

    this._renderFilm();
    this._filmView.setFilmControlButtonHandler(this._filmControlButtonHandler);
  }

  _renderFilm() {
    render(this._renderPlace, this._filmView, this._renderPosition);
  }

  destroy() {
    remove(this._filmView);
  }

  _filmControlButtonHandler(evt) {
    if(evt.target.tagName === 'BUTTON') {
      evt.target.classList.toggle('film-card__controls-item--active');
      // const buttonName = evt.target.name;
      // const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
    }
  }
}
