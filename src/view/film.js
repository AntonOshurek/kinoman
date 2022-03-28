// import dayjs from 'dayjs';
import { createElement } from '../services/render';
import { dateFormater } from '../utils/utils';

const createFilmTemplate = (filmData) => {
  const {comments, film_info: filmInfo } = filmData;
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
    <article class="film-card">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.total_rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatDate}</span>
        <span class="film-card__duration">1h 55m</span>
        <span class="film-card__genre">${filmInfo.genre.join(', ')}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${checkFilmDesriptionLength()}</p>
      <a class="film-card__comments">${comments.length}</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class Film {
  constructor(filmData) {
    this.filmData = filmData;
    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return createFilmTemplate(this.filmData);
  }

  removeElement() {
    this._element = null;
  }
}
