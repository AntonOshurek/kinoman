import PopupView from '../view/popup';

import { SITE_BODY, SITE_MAIN, RenderPosition } from '../utils/constants';
import { remove, render, replace } from '../utils/render';

export default class PopupPresenter {
  constructor(handleFilmChange, setpopupStatus) {
    this._popupComponent = null;
    this._film = null;
    this._comments = null;
    // this._handleFilmChange = handleFilmChange;
    // this._setpopupStatus = setpopupStatus;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleInputComment = this._handleInputComment.bind(this);
    this._handleEmojiChoise = this._handleEmojiChoise.bind(this);
  }

  init(popupFilmData) {
    const {film, comments} = popupFilmData;
    this._film = film;
    this._comments = comments;

    const prevPopupComponent = this._popupComponent;

    if(prevPopupComponent === null) {
      this._openPopup();
    } else {
      this._generatePopupComponent();
      replace(this._popupComponent, prevPopupComponent);
      // this._setAllClickHandlers();
    }
    remove(prevPopupComponent);
  }

  _generatePopupComponent() {
    this._popupComponent = new PopupView(this._film, this._comments);
  }

  _closePopup() {
    // this._setpopupStatus(false);
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
    this._popupComponent.setCommentInputHandler(this._handleInputComment);
    this._popupComponent.setEmojiChoiseHandler(this._handleEmojiChoise);
  }

  _openPopup() {
    // this._setpopupStatus(true);
    this._generatePopupComponent();
    render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);
    this._setAllClickHandlers();

    SITE_BODY.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleInputComment(evt) {
    const comment = evt.target.value;
  }

  _handleEmojiChoise(evt) {
    const commentImageName = evt.target.value;
    this._popupComponent.replaceCommentImage(commentImageName);
  }

  _handleWatchlistClick() {
    this._film.user_details.watchlist = !this._film.user_details.watchlist;
    // this._handleFilmChange(this._film);
  }

  _handleWatchedClick() {
    // eslint-disable-next-line camelcase
    this._film.user_details.already_watched = !this._film.user_details.already_watched;
    // this._handleFilmChange(this._filmData);
  }

  _handleFavoriteClick() {
    this._film.user_details.favorite = !this._film.user_details.favorite;
    // this._handleFilmChange(this._filmData);
  }
}
