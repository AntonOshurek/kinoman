import { createElement } from '../utils/render';

const createFooterTemplate = (filmsCount) => `
  <p>${filmsCount} movies inside</p>
  `;

export default class Footer {
  constructor(filmsCount) {
    this.filmsCount = filmsCount;
    this._element = null;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return createFooterTemplate(this.filmsCount);
  }

  removeElement() {
    this._element = null;
  }
}
