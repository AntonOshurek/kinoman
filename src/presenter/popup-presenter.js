import PopupView from '../view/popup';

import { SITE_BODY, SITE_MAIN, RenderPosition, UPDATE_TYPE } from '../utils/constants';
import { generateComment } from '../utils/common';
import { remove, render, replace } from '../utils/render';

export default class PopupPresenter {
  constructor(filmsModel, commentsModel, siteFilmsView) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
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
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);

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
      this._searchFilmDataForPopup();
      this._generatePopupComponent();
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
    const comments = film.comments.map((commentID) => this._commentsModel.getComments().find((com) => (com.id === commentID)));
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
    this._popupComponent.setCommentAddHandler(this._addCommentHandler);
    this._popupComponent.setDeleteCommentHandler(this._deleteCommentHandler);
  }

  _openPopup() {
    this._generatePopupComponent();
    render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);
    this._setAllClickHandlers();

    SITE_BODY.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleInputComment(evt) {
    this._commentText = evt.target.value;
  }

  _handleEmojiChoise(evt) {
    this._commentEmotion = evt.target.value;
    this._popupComponent.replaceCommentImage(this._commentEmotion);
  }

  _handleWatchlistClick() {
    this._popupCurrentFilm.film.user_details.watchlist = !this._popupCurrentFilm.film.user_details.watchlist;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm.film);
  }

  _handleWatchedClick() {
    // eslint-disable-next-line camelcase
    this._popupCurrentFilm.film.user_details.already_watched = !this._popupCurrentFilm.film.user_details.already_watched;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm.film);
  }

  _handleFavoriteClick() {
    this._popupCurrentFilm.film.user_details.favorite = !this._popupCurrentFilm.film.user_details.favorite;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm.film);
  }

  _addCommentHandler() {
    const film = this._popupCurrentFilm.film;
    const newComment = generateComment(this._commentText, this._commentEmotion);
    film.comments.push(newComment.id);
    this._commentsModel.addComment(UPDATE_TYPE.ADD_COMMENT, newComment);
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, film);
  }

  _deleteCommentHandler(commentUNID) {
    const film = this._popupCurrentFilm.film;
    const deleteCommentIndex = film.comments.indexOf(film.comments.find((com) => com === commentUNID));
    film.comments.splice(deleteCommentIndex, 1);
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, film);

    const deletedComment = this._popupCurrentFilm.comments.find((com) => com.id === commentUNID);
    this._commentsModel.deleteComment(UPDATE_TYPE.DELETE_COMMENT, deletedComment);
  }
}
