import PopupView from '../view/popup';

import { SITE_BODY, SITE_MAIN, RenderPosition } from '../utils/constants';
import { remove, render, replace } from '../utils/render';
import { onEscKeyDown } from '../utils/common';

export default class PopupPresenter {
  constructor(handleFilmChange, siteFilmsView) {
    this._popupComponent = null;
    this._siteFilmsView = siteFilmsView;
    this._defaultFilmsArray = [];
    this._commentsArray = [];
    this._handleFilmChange = handleFilmChange;

    this._currentFilm = null;
    this._currentFilmComments = null;
    this._filmUNID = null;

    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._siteFilmsView.setOpenPopupClikHandler(this._openPopup);
  }

  init(defaultFilmsArray, commentsArray) {
    this._defaultFilmsArray = defaultFilmsArray;
    this._commentsArray = commentsArray;

    const prevPopupComponent = this._popupComponent;

    if(prevPopupComponent === null) {
      return;
    } else {
      this._searchCurrentFilm();
      this._generatePopupComponent();
      replace(this._popupComponent, prevPopupComponent);
      this._setAllClickHandlers();
    }
    remove(prevPopupComponent);
  }

  _generatePopupComponent() {
    this._popupComponent = new PopupView(this._currentFilm, this._currentFilmComments);
  }

  _searchCurrentFilm() {
    this._currentFilm = this._defaultFilmsArray.find((film) => film.id === this._filmUNID);
  }

  _closePopup() {
    SITE_BODY.classList.remove('hide-overflow');
    remove(this._popupComponent);
    this._popupComponent = null;
    document.removeEventListener('keydown', onEscKeyDown);
    this._siteFilmsView.setOpenPopupClikHandler(this._openPopup);
  }

  _setAllClickHandlers() {
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setClosePopupButtonClickHandler(this._closePopup);
  }

  _openPopup(evt) {
    if(evt.target.closest('.film-card__poster')) {
      this._filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
      this._searchCurrentFilm();
      //search film comments
      this._currentFilmComments = this._currentFilm.comments.map((commentID) => this._commentsArray.find((com) => (com.id === commentID)));

      this. _generatePopupComponent();
      render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);
      this._setAllClickHandlers();

      SITE_BODY.classList.add('hide-overflow'); //hide scroll
      this._siteFilmsView.removeOpenPopupClikHandler();
      document.addEventListener('keydown', () => onEscKeyDown(evt, this._closePopup()));
    }
  }

  _handleWatchlistClick() {
    this._currentFilm.user_details.watchlist = !this._currentFilm.user_details.watchlist;
    this._handleFilmChange(this._currentFilm);
  }

  _handleWatchedClick() {
    // eslint-disable-next-line camelcase
    this._currentFilm.user_details.already_watched = !this._currentFilm.user_details.already_watched;
    this._handleFilmChange(this._currentFilm);
  }

  _handleFavoriteClick() {
    this._currentFilm.user_details.favorite = !this._currentFilm.user_details.favorite;
    this._handleFilmChange(this._currentFilm);
  }
}
