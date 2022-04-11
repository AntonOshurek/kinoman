import NavigationView from '../view/navigation';
import { render } from '../utils/render';
import { SITE_MAIN, RenderPosition } from '../utils/constants';

export default class NavigationPresenter {
  constructor() {
    this._navigationTemplate = null;
    this._defaultFilmsArray = null;
    this._sortByMenuFilmsArray = null;
    this._filmsBoardPresenter = null;

    this._userDetails = {};

    this._navClickHandler = this._navClickHandler.bind(this);
  }

  init(defaultFilmsArray, filmsBoardPresenter) {
    this._filmsBoardPresenter = filmsBoardPresenter;
    this._defaultFilmsArray = defaultFilmsArray;
    this._sortByMenuFilmsArray = defaultFilmsArray;
    this._searchFilmsCounts();
    this._navigationTemplate = new NavigationView(this._userDetails);
    this._renderNavigation();
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

  _sortFilms(navName) {
    switch(navName) {
      case 'all':
        this._sortByMenuFilmsArray = this._defaultFilmsArray;
        break;
      case 'favorites':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.filter((item) => item.user_details.favorite === true );
        break;
      case 'watchlist':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.filter((item) => item.user_details.watchlist === true );
        break;
      case 'history':
        this._sortByMenuFilmsArray = this._defaultFilmsArray.filter((item) => item.user_details.already_watched === true );
        break;
      case 'stats':
        break;
    }
  }

  _navClickHandler(evt) {
    if(evt.target.tagName === 'A') {
      const navName = evt.target.getAttribute('data-nav-name');
      this._sortFilms(navName);
      this._filmsBoardPresenter.initNewWachList(this._sortByMenuFilmsArray);
    }
  }
}
