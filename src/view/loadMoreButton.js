import { createElement } from '../services/render';

const createLoadMoreButton = () => (
  `
  <button class="films-list__show-more">Show more</button>
  `
);

export default class LoadMoreButton {
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
    return createLoadMoreButton();
  }

  removeElement() {
    this._element = null;
  }
}
