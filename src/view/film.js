import AbstractView from './abstract-view';
import { dateFormater, transformRuntime } from '../utils/date';

const createFilmTemplate = (filmData) => {
  const {id, title, totalRating, releaseDate, runtime, genre, poster, posterALT, description, commentsLength, watchList, alredyWatched, favorite} = filmData;

  return `
    <article class="film-card" data-unid=${id}>
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${posterALT} poster" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsLength}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchList ? 'film-card__controls-item--active' : ''}" name="watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alredyWatched ? 'film-card__controls-item--active' : ''}" name="already_watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}" name="favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class Film extends AbstractView {
  constructor(filmData) {
    super();
    this._filmData = filmData;
    this._convertedFilmData = this._transformDataForView();

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  _checkFilmDesriptionLength() {
    if(this._filmData.film_info.description.length >= 140) {
      const sliceString = this._filmData.film_info.description.slice(0, 139);
      const result = `${sliceString}...`;
      return result;
    } else {
      return this._filmData.film_info.description;
    }
  }

  _transformDataForView() {
    return {
      id: this._filmData.id,
      title: this._filmData.film_info.title,
      totalRating: this._filmData.film_info.total_rating,
      releaseDate: dateFormater(this._filmData.film_info.release.date),
      runtime: transformRuntime(this._filmData.film_info.runtime),
      genre: this._filmData.film_info.genre.join(', '),
      poster: this._filmData.film_info.poster,
      posterALT: this._filmData.film_info.poster.slice(0, this._filmData.film_info.poster.length - 4),
      description: this._checkFilmDesriptionLength(),
      commentsLength: this._filmData.comments.length,
      watchList: this._filmData.user_details.watchlist,
      alredyWatched: this._filmData.user_details.already_watched,
      favorite: this._filmData.user_details.favorite,
    };
  }

  getTemplate() {
    return createFilmTemplate(this._convertedFilmData);
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
