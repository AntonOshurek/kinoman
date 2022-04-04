import AbstractView from './abstract-view';

const createFilmsTemplate = () => (
  `
    <section class="films">

    </section>
  `
);

export default class Films extends AbstractView {
  constructor() {
    super();

    this._openPopupClikHandler = this._openPopupClikHandler.bind(this);
  }

  getTemplate() {
    return createFilmsTemplate();
  }

  _openPopupClikHandler(evt) {
    evt.preventDefault();
    this._callback.popupClick(evt);
  }

  setOpenPopupClikHandler(callback) {
    this._callback.popupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClikHandler);
  }

}
