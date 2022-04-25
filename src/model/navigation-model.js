import AbstractObserver from '../utils/abstract-observer';
import { NAVIGATION_FIELDS } from '../utils/constants';

export default class NavigationModel extends AbstractObserver {

  constructor() {
    super();
    this._navigationField = NAVIGATION_FIELDS.ALL;
  }

  getNavigationField() {
    return this._navigationField;
  }

  setNavigationField(updateType, field) {
    this._navigationField = field;
    this._notify(updateType, field);
  }
}
