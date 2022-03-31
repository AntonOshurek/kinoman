import { createElement } from '../utils/render';

const createFilmsTemplate = () => (
  `
    <section class="films">

    </section>
  `
);

export default class Films {
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
    return createFilmsTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
