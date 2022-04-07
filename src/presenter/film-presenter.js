import FilmView from '../view/film';
import { render } from '../utils/render';

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

  _filmControlButtonHandler(evt) {
    if(evt.target.tagName === 'BUTTON') {
      // const buttonName = evt.target.name;
      // const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
    }
  }
}
