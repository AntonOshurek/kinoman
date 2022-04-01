import AbstractView from './abstract-view';

const createLoadMoreButton = () => (
  `
  <button class="films-list__show-more">Show more</button>
  `
);

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();

    this._paginationClickHandler = this._paginationClickHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreButton();
  }

  _paginationClickHandler(evt) {
    evt.preventDefault();
    this._callback.paginationClick(evt);
  }

  setPaginationClickHandler(callback) {
    this._callback.paginationClick = callback;
    this.getElement().addEventListener('click', this._paginationClickHandler);
  }
}
