import { createElement } from '../services/render';

const createFilmsListTemplate = () => `
  <section class="films-list films-list--main">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container films-list__container--main">

    </div>
  </section>
`;

export default class FilmsList {
  constructor() {
    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return createFilmsListTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
