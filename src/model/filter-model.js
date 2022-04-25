import AbstractObserver from '../utils/abstract-observer';
import { FILTER_FIELDS } from '../utils/constants';

export default class FilterModel extends AbstractObserver {

  constructor() {
    super();
    this._filter = FILTER_FIELDS.ALL;
  }

  getFilter() {
    return this._filter;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }
}
