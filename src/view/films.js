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
    if(evt.target.closest('.film-card__poster')) {
      const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
      this._callback.popupClick(filmUNID);
    }
  }

  setOpenPopupClikHandler(callback) {
    this._callback.popupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClikHandler);
  }

  removeOpenPopupClikHandler() {
    this.getElement().removeEventListener('click', this._openPopupClikHandler);
  }

}
