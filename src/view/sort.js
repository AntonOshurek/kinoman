import { createElement } from '../utils/render';

const createSortTemplate = () => (
  `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--default sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button sort__button--date">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--rating">Sort by rating</a></li>
  </ul>
  `
);

export default class Sort {
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
    return createSortTemplate();
  }

  removeElement() {
    this._element = null;
  }
}
