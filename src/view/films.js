import { createFilmsListTemplate } from './films-list';
import { createFilmsListTopTemplate } from './films-list-top';
import { createFilmsListCommentedTemplate } from './films-list-commented';

import { generateFilm } from '../mock/mock';

const FILMS_COUNT = 12;
const filmsArray = Array.from({length: FILMS_COUNT}, generateFilm);

export const createFilmsTemplate = () => (
  `
    <section class="films">
      ${createFilmsListTemplate(filmsArray)}
      ${createFilmsListTopTemplate()}
      ${createFilmsListCommentedTemplate()}
    </section>
  `
);
