import AbstractView from './abstract-view';

const createFilmsListTitleTemplate = () => `
    <h2 class="films-list__title">title</h2>
`;

export default class FilmsList extends AbstractView {
  getTemplate() {
    return createFilmsListTitleTemplate();
  }
}
