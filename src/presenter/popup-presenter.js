import PopupView from '../view/popup';

import { fishText } from '../../node_modules/fish-text/fish-text.js';
import { getUNID } from '../utils/common';
import { getNowDate } from '../utils/date';

import { SITE_BODY, SITE_MAIN, RenderPosition, UPDATE_TYPE } from '../utils/constants';
import { remove, render, replace } from '../utils/render';

export default class PopupPresenter {
  constructor(filmsModel, siteFilmsView) {
    this._filmsModel = filmsModel;
    this._siteFilmsView = siteFilmsView;

    this._popupComponent = null;
    this._filmUNID = null;
    this._popupCurrentFilm = null;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleInputComment = this._handleInputComment.bind(this);
    this._handleEmojiChoise = this._handleEmojiChoise.bind(this);
    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    this._handleModelPopupEvent = this._handleModelPopupEvent.bind(this);

    this._siteFilmsView.setOpenPopupClikHandler(this._openPopupClickHandler);
  }

  init() {
    const prevPopupComponent = this._popupComponent;
    this._commentEmotion = null;
    this._commentText = null;

    this._filmsModel.addObserver(this._handleModelPopupEvent);

    if(prevPopupComponent === null) {
      this._openPopup();
    } else {
      this._generatePopupComponent();
      this._searchFilmDataForPopup();
      replace(this._popupComponent, prevPopupComponent);
      this._setAllClickHandlers();
    }
    remove(prevPopupComponent);
  }

  _handleModelPopupEvent() {
    this.init();
  }

  _searchFilmDataForPopup() {
    const film = this._filmsModel.getFilms().find((fl) => fl.id === this._filmUNID);
    const comments = film.comments.map((commentID) => this._filmsModel.getComments().find((com) => (com.id === commentID)));
    this._popupCurrentFilm = {
      film,
      comments,
    };
  }

  _openPopupClickHandler(filmUNID) {
    this._filmUNID = filmUNID;
    this._searchFilmDataForPopup();
    this.init();
  }

  _generatePopupComponent() {
    this._popupComponent = new PopupView(this._popupCurrentFilm.film, this._popupCurrentFilm.comments);
  }

  _closePopup() {
    SITE_BODY.classList.remove('hide-overflow');
    remove(this._popupComponent);
    this._popupComponent = null;
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._filmsModel.removeObserver(this._handleModelPopupEvent);
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
    this._generatePopupComponent();
    render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);
    this._setAllClickHandlers();

    SITE_BODY.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _generateComment() {
    return {
      'id': getUNID(),
      'author': fishText.getNames({count: 1, type: 'full'}),
      'comment': this._commentText,
      'date': getNowDate(),
      'emotion': this._commentEmotion,
    };
  }

  _handleInputComment(evt) {
    this._commentText = evt.target.value;
  }

  _handleEmojiChoise(evt) {
    this._commentEmotion = evt.target.value;
    this._popupComponent.replaceCommentImage(this._commentEmotion);
  }

  _handleWatchlistClick() {
    const newFilm = Object.assign({}, this._popupCurrentFilm.film);
    newFilm.user_details.watchlist = !newFilm.user_details.watchlist;
    this._filmsModel.updateFilm(UPDATE_TYPE.PATCH, newFilm);
    // this.init();
  }

  _handleWatchedClick() {
    const newFilm = Object.assign({}, this._popupCurrentFilm.film);
    // eslint-disable-next-line camelcase
    newFilm.user_details.already_watched = !newFilm.user_details.already_watched;
    this._filmsModel.updateFilm(UPDATE_TYPE.PATCH, newFilm);
    // this.init();
  }

  _handleFavoriteClick() {
    const newFilm = Object.assign({}, this._popupCurrentFilm.film);
    newFilm.user_details.favorite = !newFilm.user_details.favorite;
    this._filmsModel.updateFilm(UPDATE_TYPE.PATCH, newFilm);
    // this.init();
  }
}
