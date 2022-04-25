import AbstractView from './abstract-view';

import { SORT_FIELDS } from '../utils/constants';

const createSortTemplate = (currentSortField) => ` <ul class="sort">
    <li><a href="#" class="sort__button sort__button--default ${currentSortField === SORT_FIELDS.DEFAULT ? 'sort__button--active' : ''}" data-filter='${SORT_FIELDS.DEFAULT}'>Sort by default</a></li>
    <li><a href="#" class="sort__button sort__button--date ${currentSortField === SORT_FIELDS.DATE ? 'sort__button--active' : ''}" data-filter='${SORT_FIELDS.DATE}'>Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--rating ${currentSortField === SORT_FIELDS.RATING ? 'sort__button--active' : ''}" data-filter='${SORT_FIELDS.RATING}'>Sort by rating</a></li>
  </ul>`;

export default class Sort extends AbstractView {
  constructor(currentSortField) {
    super();
    this._currentSortField = currentSortField;
    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortField);
  }

  _sortClickHandler(evt) {
    evt.preventDefault();
    if(evt.target.tagName === 'A') {
      this._callback.sortClick(evt.target.getAttribute('data-filter'));
    }
  }

  setSortClickHandler(callback) {
    this._callback.sortClick = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}
