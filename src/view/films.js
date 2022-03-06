import { createFilmsListTemplate } from './films-list';
import { createFilmsListTopTemplate } from './films-list-top';
import { createFilmsListCommentedTemplate } from './films-list-commented';

export const createFilmsTemplate = () => (
  `
    <section class="films">
      ${createFilmsListTemplate()}
      ${createFilmsListTopTemplate()}
      ${createFilmsListCommentedTemplate()}
    </section>
  `
);
