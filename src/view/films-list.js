import AbstractView from './abstract-view';

const createFilmsListTemplate = () => `
  <section class="films-list films-list--main">
    <h2 class="films-list__title">title</h2>
    <div class="films-list__container films-list__container--main">

    </div>
  </section>`;

export default class FilmsList extends AbstractView {
  constructor(filmsArrayIsEmpty) {
    super();
    this._filmsArrayIsEmpty = filmsArrayIsEmpty;
  }

  getTemplate() {
    return createFilmsListTemplate(this._filmsArrayIsEmpty);
  }
}
