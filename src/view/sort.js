import AbstractView from './abstract-view';

const createSortTemplate = () => (
  `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--default sort__button--active" data-filter='default'>Sort by default</a></li>
    <li><a href="#" class="sort__button sort__button--date" data-filter='date'>Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--rating" data-filter='total_rating'>Sort by rating</a></li>
  </ul>
  `
);

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortClickHandler(evt) {
    evt.preventDefault();
    this._callback.sortClick(evt);
  }

  setSortClickHandler(callback) {
    this._callback.sortClick = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
