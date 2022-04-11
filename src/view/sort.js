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

  resetSort() {
    this._addActiveClassForSortButton(this.getElement().querySelector('.sort__button--default'));
  }

  _addActiveClassForSortButton(currentButton) {
    this.getElement().querySelectorAll('.sort__button').forEach((btn) => btn.classList.remove('sort__button--active'));
    currentButton.classList.add('sort__button--active');
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortClickHandler(evt) {
    evt.preventDefault();
    if(evt.target.tagName !== 'A') {
      return;
    }
    this._addActiveClassForSortButton(evt.target);
    this._callback.sortClick(evt.target.getAttribute('data-filter'));
  }

  setSortClickHandler(callback) {
    this._callback.sortClick = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
