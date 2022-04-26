import NavigationView from '../view/navigation';
import { render, remove, replace } from '../utils/render';
import { SITE_MAIN, RenderPosition, NAVIGATION_FIELDS, UPDATE_TYPE } from '../utils/constants';
import { filter } from '../utils/common';

export default class NavigationPresenter {
  constructor(filmsModel, navigationModel) {
    this._navigationModel = navigationModel;
    this._filmsModel = filmsModel;
    this._navigationComponent = null;

    this._navClickHandler = this._navClickHandler.bind(this);
    this._handleModelNavigationEvent = this._handleModelNavigationEvent.bind(this);
  }

  init() {
    const prevNavigationComponent = this._navigationComponent;

    this._navigationComponent = new NavigationView(this.getFilters(), this._navigationModel.getNavigationField());

    this._navigationModel.addObserver(this._handleModelNavigationEvent);
    this._filmsModel.addObserver(this._handleModelNavigationEvent);

    if(prevNavigationComponent === null) {
      render(SITE_MAIN, this._navigationComponent, RenderPosition.BEFOREBEGIN);
    } else {
      replace(this._navigationComponent, prevNavigationComponent);
      remove(prevNavigationComponent);
    }
    this._navigationComponent.setNavClickHandler(this._navClickHandler);
  }

  _handleModelNavigationEvent() {
    this.init();
  }

  _navClickHandler(currentMenuField) {
    if(this._navigationModel.getNavigationField() !== currentMenuField) {
      this._navigationModel.setNavigationField(UPDATE_TYPE.MAJOR, currentMenuField);
    }
  }

  getFilters() {
    const films = this._filmsModel.getFilms();
    return {
      [NAVIGATION_FIELDS.WATCHLIST]: filter[NAVIGATION_FIELDS.WATCHLIST](films).length,
      [NAVIGATION_FIELDS.FAVORITES]: filter[NAVIGATION_FIELDS.FAVORITES](films).length,
      [NAVIGATION_FIELDS.HISTORY]: filter[NAVIGATION_FIELDS.HISTORY](films).length,
    };
  }
}
