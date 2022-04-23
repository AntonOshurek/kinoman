import NavigationView from '../view/navigation';
import { render, remove, replace } from '../utils/render';
import { SITE_MAIN, RenderPosition, MENU_FIELDS } from '../utils/constants';

export default class NavigationPresenter {
  constructor(showFilmsListByCurrentMenu) {
    this._navigationTemplate = null;
    this._defaultFilmsArray = null;
    this._currentMenuData = null;
    this._currentMenuField = MENU_FIELDS.ALL;
    this._filmsCount = {};// object for films counts | first init
    this._showFilmsListByCurrentMenu = showFilmsListByCurrentMenu; //callback function for click handler from board presenter

    this._navClickHandler = this._navClickHandler.bind(this);
  }

  init(defaultFilmsArray) {
    this._defaultFilmsArray = defaultFilmsArray;
    const prevNavigationComponent = this._navigationTemplate;

    this._filmsCount = {}; // reset films count
    this._searchFilmsCounts();
    this._navigationTemplate = new NavigationView(this._filmsCount);

    if(prevNavigationComponent === null) {
      this._renderNavigation();
    } else {
      replace(this._navigationTemplate, prevNavigationComponent);
      if(this._currentMenuField !== MENU_FIELDS.ALL) {
        this._addActiveClassForCurrentMenuItem();
        this._filterFilms(this._currentMenuField);
        this._showFilmsListByCurrentMenu(this._currentMenuData, this._currentMenuField);
      }
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
        !this._filmsCount.watchlist ? this._filmsCount.watchlist = 1 : this._filmsCount.watchlist += 1;
      }
      if(film.user_details.already_watched) {
        !this._filmsCount.alreadyWatched ? this._filmsCount.alreadyWatched = 1 : this._filmsCount.alreadyWatched += 1;
      }
      if(film.user_details.favorite) {
        !this._filmsCount.favorite ? this._filmsCount.favorite = 1 : this._filmsCount.favorite += 1;
      }
    });
  }

  _filterFilms() {
    switch(this._currentMenuField) {
      case MENU_FIELDS.ALL:
        this._currentMenuData = this._defaultFilmsArray;
        break;
      case MENU_FIELDS.FAVORITES:
        this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.favorite === true );
        break;
      case MENU_FIELDS.WATCHLIST:
        this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.watchlist === true );
        break;
      case MENU_FIELDS.HISTORY:
        this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.already_watched === true );
        break;
      case MENU_FIELDS.STATS:
        break;
    }
  }

  _addActiveClassForCurrentMenuItem() {
    this._navigationTemplate.getElement().querySelectorAll('A').forEach((navElem) => {
      if(navElem.getAttribute('data-nav-name') === this._currentMenuField) {
        navElem.classList.add('main-navigation__item--active');
      } else {
        navElem.classList.remove('main-navigation__item--active');
      }
    });
  }

  _navClickHandler(currentMenuField) {
    this._currentMenuField = currentMenuField;
    this._addActiveClassForCurrentMenuItem();
    this._filterFilms();
    this._showFilmsListByCurrentMenu(this._currentMenuData, this._currentMenuField);
  }
}
