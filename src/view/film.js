import AbstractView from './abstract-view';
import { dateFormater, transformRuntime } from '../utils/date';

const createFilmTemplate = (filmData) => {
  const {comments, id, film_info: filmInfo } = filmData;
  const formatDate = dateFormater(filmInfo.release.date);

  const checkFilmDesriptionLength = () => {
    if(filmInfo.description.length >= 140) {
      const sliceString = filmInfo.description.slice(0, 139);
      const result = `${sliceString  }...`;
      return result;
    } else {
      return filmInfo.description;
    }
  };

  return `
    <article class="film-card" data-unid=${id}>
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.total_rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatDate}</span>
        <span class="film-card__duration">${transformRuntime(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre.join(', ')}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${checkFilmDesriptionLength()}</p>
      <a class="film-card__comments">${comments.length}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" name="watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" name="watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" name="favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class Film extends AbstractView {
  constructor(filmData) {
    super();
    this.filmData = filmData;

    this._controlsButtonsBlock = this.getElement().querySelector('.film-card__controls');

    this._filmControlButtonHandler = this._filmControlButtonHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this.filmData);
  }

  _filmControlButtonHandler(evt) {
    evt.preventDefault();
    this._callback.filmButtonClick(evt);
  }

  setFilmControlButtonHandler(callback) {
    this._callback.filmButtonClick = callback;
    this._controlsButtonsBlock.addEventListener('click', this._filmControlButtonHandler);
  }
}
