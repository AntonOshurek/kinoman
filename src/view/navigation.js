import AbstractView from './abstract-view';
import { NAVIGATION_FIELDS } from '../utils/constants';

const createNavigationTemplate = (userDetails) => {
  const { watchlist, history, favorites} = userDetails;
  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" data-nav-name='all' class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-nav-name='watchlist' class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist ? watchlist : '0'}</span></a>
      <a href="#history" data-nav-name='history' class="main-navigation__item">History <span class="main-navigation__item-count">${history ? history : '0'}</span></a>
      <a href="#favorites" data-nav-name='favorites' class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites ? favorites : '0'}</span></a>
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

  _navClickHandler(evt) {
    evt.preventDefault();
    if(evt.target.tagName === 'A') {
      const navigationName = evt.target.getAttribute('data-nav-name');
      this._callback.navClick(navigationName);
    }
  }

  setNavClickHandler(callback) {
    this._callback.navClick = callback;
    this._navButtonsBlock.addEventListener('click', this._navClickHandler);
  }
}

