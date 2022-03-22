import { createFilmTemplate } from './film';

export const createFilmsListTemplate = (filmsArray) => {

  const generateFilmsList = () => {
    let filmsList = '';
    filmsArray.forEach((film) => {
      filmsList += createFilmTemplate(film);
    });
    return filmsList;
  };

  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
        ${generateFilmsList()}
      </div>
      <button class="films-list__show-more">Show more</button>
    </section>
  `;
};
