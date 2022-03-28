import { createElement } from '../services/render';

const createFilmsListCommentedTemplate = () => (
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container films-list__container--commented">

      </div>
    </section>
  `
);

export default class FilmsListCommented {
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
    return createFilmsListCommentedTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
