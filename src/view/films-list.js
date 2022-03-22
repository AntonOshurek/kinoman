import { generateFilm } from '../mock/mock';

export const createFilmsListTemplate = () => {

  const generateOneFilm = (film) => {
    const {title, description, poster, comments, rating} = film;
    return `
      <article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">1929</span>
          <span class="film-card__duration">1h 55m</span>
          <span class="film-card__genre">Musical</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length}</a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
        </div>
      </article>
    `;
  };

  const FILMS_COUNT = 12;
  const filmsArray = Array.from({length: FILMS_COUNT}, generateFilm);

  let filmsList = '';

  filmsArray.forEach((film) => {
    filmsList += generateOneFilm(film);
  });

  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
        ${filmsList}
      </div>
      <button class="films-list__show-more">Show more</button>
    </section>
  `;
};
