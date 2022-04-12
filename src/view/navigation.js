import AbstractView from './abstract-view';

const createNavigationTemplate = (userDetails) => {
  const { watchlist, alreadyWatched, favorite } = userDetails;
  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-nav-name='all' class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-nav-name='watchlist' class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist ? watchlist : '0'}</span></a>
      <a href="#history" data-nav-name='history' class="main-navigation__item">History <span class="main-navigation__item-count">${alreadyWatched ? alreadyWatched : '0'}</span></a>
      <a href="#favorites" data-nav-name='favorites' class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite ? favorite : '0'}</span></a>
    </div>
    <a href="#stats" data-nav-name='stats' class="main-navigation__additional">Stats</a>
  </nav>
  `;
};

export default class Naigation extends AbstractView {
  constructor(userDetails) {
    super();

    this._userDetails = userDetails;
    this._navButtonsBlock = this.getElement();
    this._navClickHandler = this._navClickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._userDetails);
  }

  _addActiveClassForCurrentMenuItem(currentButton) {
    this._navButtonsBlock.querySelectorAll('A').forEach((navElem) => navElem.classList.remove('main-navigation__item--active'));
    currentButton.classList.add('main-navigation__item--active');
  }

  _navClickHandler(evt) {
    evt.preventDefault();
    this._addActiveClassForCurrentMenuItem(evt.target);
    this._callback.navClick(evt);
  }

  setNavClickHandler(callback) {
    this._callback.navClick = callback;
    this._navButtonsBlock.addEventListener('click', this._navClickHandler);
  }
}

