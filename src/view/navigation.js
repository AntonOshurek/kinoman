import AbstractView from './abstract-view';

const createNavigationTemplate = () => (
  `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  `
);

export default class Naigation extends AbstractView {
  constructor() {
    super();

    this._navButtonsBlock = this.getElement();
    this._navClickHandler = this._navClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate();
  }

  _navClickHandler(evt) {
    evt.preventDefault();
    this._callback.navClick(evt);
  }

  setNavClickHandler(callback) {
    this._callback.navClick = callback;
    this._navButtonsBlock.addEventListener('click', this._navClickHandler);
  }
}

