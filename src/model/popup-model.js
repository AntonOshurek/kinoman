import AbstractObserver from '../utils/abstract-observer';

export default class PopupModel extends AbstractObserver {

  constructor() {
    super();
    this._popupStatus = false;
  }

  getPopupStatus() {
    return this._popupStatus;
  }

  setPopupStatus(updateType, status) {
    this._popupStatus = status;
    this._notify(updateType, status);
  }
}
