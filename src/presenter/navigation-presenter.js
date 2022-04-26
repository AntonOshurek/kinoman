import NavigationView from '../view/navigation';
import { render, remove, replace } from '../utils/render';
import { SITE_MAIN, RenderPosition, NAVIGATION_FIELDS, UPDATE_TYPE } from '../utils/constants';
import { filter } from '../utils/common';

export default class NavigationPresenter {
  constructor(filmsModel, navigationModel) {
    this._navigationModel = navigationModel;
    this._filmsModel = filmsModel;
    this._navigationComponent = null;
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
    const prevNavigationComponent = this._navigationComponent;

    this._navigationComponent = new NavigationView(this.getFilters(), this._navigationModel.getNavigationField());
    this._navClickHandler = this._navClickHandler.bind(this);

    if(prevNavigationComponent === null) {
      this._renderNavigation();
      this._navigationComponent.setNavClickHandler(this._navClickHandler);
      return;
    }

    replace(this._navigationTemplate, prevNavigationComponent);
    remove(prevNavigationComponent);
    this._navigationComponent.setNavClickHandler(this._navClickHandler);
  }

  _renderNavigation() {
    render(SITE_MAIN, this._navigationComponent, RenderPosition.BEFOREBEGIN);
  }

  _navClickHandler(currentMenuField) {
    if(this._navigationModel.getNavigationField() === currentMenuField) {
      return;
    }
    this._navigationModel.setNavigationField(UPDATE_TYPE.MAJOR, currentMenuField);
  }
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
