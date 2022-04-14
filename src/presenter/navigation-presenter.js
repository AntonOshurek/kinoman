import NavigationView from '../view/navigation';
import { render, remove, replace } from '../utils/render';
import { SITE_MAIN, RenderPosition } from '../utils/constants';

export default class NavigationPresenter {
  constructor(showFilmsListByCurrentMenu) {
    this._navigationTemplate = null;
    this._defaultFilmsArray = null;
    this._sortByMenuFilmsArray = null;
    this._showFilmsListByCurrentMenu = showFilmsListByCurrentMenu;
    this._activeNavigationButton = null;

    this._userDetails = {};

    this._navClickHandler = this._navClickHandler.bind(this);
  }

  init(defaultFilmsArray) {
    this._defaultFilmsArray = defaultFilmsArray;
    this._sortByMenuFilmsArray = defaultFilmsArray;

    const prevNavigationComponent = this._navigationTemplate;

    this._userDetails = {};
    this._searchFilmsCounts();
    this._navigationTemplate = new NavigationView(this._userDetails);

    if(prevNavigationComponent === null) {
      this._renderNavigation();
    } else {
      replace(this._navigationTemplate, prevNavigationComponent);
      this._activeNavigationButton ? this._addActiveClassForCurrentMenuItem() : null;
    }
    remove(prevNavigationComponent);

    this._navigationTemplate.setNavClickHandler(this._navClickHandler);
  }

  _renderNavigation() {
    render(SITE_MAIN, this._navigationTemplate, RenderPosition.AFTERBEGIN);
  }

  _searchFilmsCounts() {
    this._defaultFilmsArray.forEach((film) => {
      if(film.user_details.watchlist) {
        !this._userDetails.watchlist ? this._userDetails.watchlist = 1 : this._userDetails.watchlist += 1;
      }
      if(film.user_details.already_watched) {
        !this._userDetails.alreadyWatched ? this._userDetails.alreadyWatched = 1 : this._userDetails.alreadyWatched += 1;
      }
      if(film.user_details.favorite) {
        !this._userDetails.favorite ? this._userDetails.favorite = 1 : this._userDetails.favorite += 1;
      }
    });
  }

  _sortFilms(navSortName) {
    switch(navSortName) {
      case 'all':
        this._sortByMenuFilmsArray = this._defaultFilmsArray;
        break;
      case 'favorites':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.slice().filter((item) => item.user_details.favorite === true );
        break;
      case 'watchlist':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.slice().filter((item) => item.user_details.watchlist === true );
        break;
      case 'history':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.slice().filter((item) => item.user_details.already_watched === true );
        break;
      case 'stats':
        break;
    }
  }

  _addActiveClassForCurrentMenuItem() {
    this._navigationTemplate.getElement().querySelectorAll('A').forEach((navElem) => {
      if(navElem.getAttribute('data-nav-name') === this._activeNavigationButton) {
        navElem.classList.add('main-navigation__item--active');
      } else {
        navElem.classList.remove('main-navigation__item--active');
      }
    });
  }

  _navClickHandler(navigationName) {
    this._activeNavigationButton = navigationName;
    this._addActiveClassForCurrentMenuItem();
    this._sortFilms(navigationName);
    this._showFilmsListByCurrentMenu(this._sortByMenuFilmsArray, navigationName);
  }
}
