import AbstractView from './abstract-view';
import { dateFormater, transformRuntime } from '../utils/date';

const createFilmTemplate = (filmData) => {
  const {comments, id, film_info: filmInfo, user_details: userDetails } = filmData;
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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? 'film-card__controls-item--active' : ''}" name="watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.already_watched ? 'film-card__controls-item--active' : ''}" name="already_watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}" name="favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class Film extends AbstractView {
  constructor(filmData) {
    super();
    this.filmData = filmData;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmTemplate(this.filmData);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClickHandler(evt);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClickHandler(evt);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClickHandler(evt);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClickHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClickHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClickHandler = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }
}
