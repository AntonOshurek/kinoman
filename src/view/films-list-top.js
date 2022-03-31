import { createElement } from '../utils/render';

const createFilmsListTopTemplate = () => (
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container films-list__container--top">

      </div>
    </section>
  `
);

export default class FilmsListTop {
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
    return createFilmsListTopTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
