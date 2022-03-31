import AbstractView from './abstract-view';

const createSortTemplate = () => (
  `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--default sort__button--active" data-filter='default'>Sort by default</a></li>
    <li><a href="#" class="sort__button sort__button--date" data-filter='date'>Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--rating" data-filter='rating'>Sort by rating</a></li>
  </ul>
  `
);

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick(evt);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().addEventListener('click', this._editClickHandler);
  }
}
