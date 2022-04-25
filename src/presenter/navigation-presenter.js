import NavigationView from '../view/navigation';
import { render, remove, replace } from '../utils/render';
import { SITE_MAIN, RenderPosition, NAVIGATION_FIELDS } from '../utils/constants';
import { filter } from '../utils/common';

export default class NavigationPresenter {
  constructor(filmsModel, navigationModel) {
    this._navigationModel = navigationModel;
    this._filmsModel = filmsModel;
    this._navigationComponent = null;
    // this._defaultFilmsArray = null;
    // this._currentMenuData = null;
    // this._currentFilterField = FILTER_FIELDS.ALL;
    // this._filmsCount = {};// object for films counts | first init
    // this._showFilmsListByCurrentMenu = showFilmsListByCurrentMenu; //callback function for click handler from board presenter

    // this._navClickHandler = this._navClickHandler.bind(this);
  }

  getFilters() {
    const films = this._filmsModel.getFilms();
    return {
      [NAVIGATION_FIELDS.WATCHLIST]: filter[NAVIGATION_FIELDS.WATCHLIST](films).length,
      [NAVIGATION_FIELDS.FAVORITES]: filter[NAVIGATION_FIELDS.FAVORITES](films).length,
      [NAVIGATION_FIELDS.HISTORY]: filter[NAVIGATION_FIELDS.HISTORY](films).length,
    };
  }

  init() {
    // this._defaultFilmsArray = defaultFilmsArray;
    const prevNavigationComponent = this._navigationComponent;

    // this._filmsCount = {}; // reset films count
    // this._searchFilmsCounts();
    this._navigationComponent = new NavigationView(this.getFilters(), this._navigationModel);

    if(prevNavigationComponent === null) {
      this._renderNavigation();
      return;
    }
    // } else {
    //   replace(this._navigationTemplate, prevNavigationComponent);
    //   if(this._currentMenuField !== FILTER_FIELDS.ALL) {
    //     this._addActiveClassForCurrentMenuItem();
    //     this._filterFilms(this._currentMenuField);
    //     this._showFilmsListByCurrentMenu(this._currentMenuData, this._currentMenuField);
    //   }
    // }
    replace(this._navigationTemplate, prevNavigationComponent);
    remove(prevNavigationComponent);

    // this._navigationTemplate.setNavClickHandler(this._navClickHandler);
  }

  _renderNavigation() {
    render(SITE_MAIN, this._navigationComponent, RenderPosition.BEFOREBEGIN);
  }

  // _filterFilms() {
  //   switch(this._currentMenuField) {
  //     case MENU_FIELDS.ALL:
  //       this._currentMenuData = this._defaultFilmsArray;
  //       break;
  //     case MENU_FIELDS.FAVORITES:
  //       this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.favorite === true );
  //       break;
  //     case MENU_FIELDS.WATCHLIST:
  //       this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.watchlist === true );
  //       break;
  //     case MENU_FIELDS.HISTORY:
  //       this._currentMenuData = this._defaultFilmsArray.slice().filter((item) => item.user_details.already_watched === true );
  //       break;
  //     case MENU_FIELDS.STATS:
  //       break;
  //   }
  // }

  // _addActiveClassForCurrentMenuItem() {
  //   this._navigationTemplate.getElement().querySelectorAll('A').forEach((navElem) => {
  //     if(navElem.getAttribute('data-nav-name') === this._currentMenuField) {
  //       navElem.classList.add('main-navigation__item--active');
  //     } else {
  //       navElem.classList.remove('main-navigation__item--active');
  //     }
  //   });
  // }

  // _navClickHandler(currentMenuField) {
  //   this._currentMenuField = currentMenuField;
  //   this._addActiveClassForCurrentMenuItem();
  //   this._filterFilms();
  //   this._showFilmsListByCurrentMenu(this._currentMenuData, this._currentMenuField);
  // }
}
