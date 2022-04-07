import FilmView from '../view/film';
import { render } from '../utils/render';
import { RenderPosition } from '../utils/constants';

export default class FilmPresenter {
  constructor() {
    this._filmView = null;

    this._filmData = null;
  }

  init(filmData) {
    this._filmData = filmData;

    this._filmView = new FilmView(this._filmData);

  }
}
