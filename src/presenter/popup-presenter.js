import PopupView from '../view/popup';

import { SITE_BODY, SITE_MAIN, RenderPosition } from '../utils/constants';
import { remove, render, replace } from '../utils/render';

export default class PopupPresenter {
  constructor(handleFilmChange, setpopupStatus) {
    this._popupComponent = null;
    this._filmData = null;
    this._commentsArray = null;
    this._handleFilmChange = handleFilmChange;
    this._setpopupStatus = setpopupStatus;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film, comments) {
    this._filmData = film;
    this._commentsArray = comments;

    const prevPopupComponent = this._popupComponent;

    if(prevPopupComponent === null) {
      this._openPopup();
    } else {
      this._generatePopupComponent();
      replace(this._popupComponent, prevPopupComponent);
      this._setAllClickHandlers();
    }
    remove(prevPopupComponent);
  }

  _generatePopupComponent() {
    this._popupComponent = new PopupView(this._filmData, this._commentsArray);
  }

  _closePopup() {
    this._setpopupStatus(false);
    SITE_BODY.classList.remove('hide-overflow');
    remove(this._popupComponent);
    this._popupComponent = null;
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _setAllClickHandlers() {
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setClosePopupButtonClickHandler(this._closePopup);
  }

  _openPopup() {
    this._setpopupStatus(true);
    this._generatePopupComponent();
    render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);
    this._setAllClickHandlers();

    SITE_BODY.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleWatchlistClick() {
    this._filmData.user_details.watchlist = !this._filmData.user_details.watchlist;
    this._handleFilmChange(this._filmData);
  }

  _handleWatchedClick() {
    // eslint-disable-next-line camelcase
    this._filmData.user_details.already_watched = !this._filmData.user_details.already_watched;
    this._handleFilmChange(this._filmData);
  }

  _handleFavoriteClick() {
    this._filmData.user_details.favorite = !this._filmData.user_details.favorite;
    this._handleFilmChange(this._filmData);
  }
}
