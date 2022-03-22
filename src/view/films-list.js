// import { createFilmTemplate } from './film';

export const createFilmsListTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">

      </div>
      <button class="films-list__show-more">Show more</button>
    </section>
  `;

// <div class="films-list__container">
// ${filmsList}
// </div>
// <button class="films-list__show-more">Show more</button>


// let filmsList = '';

// filmsArray.forEach((film) => {
//   filmsList += createFilmTemplate(film);
// });
