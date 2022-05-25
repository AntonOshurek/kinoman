import PopupView from '../view/popup';
import FilmComments from '../view/film-comments';

import { SITE_BODY, SITE_MAIN, RenderPosition, UPDATE_TYPE } from '../utils/constants';
import { generateComment } from '../utils/common';
import { remove, render, replace } from '../utils/render';

export default class PopupPresenter {
  constructor(filmsModel, commentsModel, siteFilmsView) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._siteFilmsView = siteFilmsView;

    this._popupComponent = null;
    this._commentsComponent = null;
    this._filmUNID = null;
    this._popupCurrentFilm = null;
    this._popupComments = null;

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
    this._checkComments = this._checkComments.bind(this);

    this._siteFilmsView.setOpenPopupClikHandler(this._openPopupClickHandler);
  }

  init() {
    const prevPopupComponent = this._popupComponent;
    this._commentEmotion = null;
    this._commentText = null;

    this._filmsModel.addObserver(this._handleModelPopupEvent);
    this._commentsModel.addObserver(this._checkComments);

    if(prevPopupComponent === null) {
      this._openPopup();
    } else {
      this._generatePopupComponent();
      this._renderComments();
      replace(this._popupComponent, prevPopupComponent);
      this._setAllClickHandlers();
    }
    remove(prevPopupComponent);
  }

  _checkComments(updateType) {
    updateType === UPDATE_TYPE.INIT_COMMENTS ? this._renderComments() : null;
  }

  _renderComments() {
    this._popupComments = this._commentsModel.getComments();
    this._commentsComponent = new FilmComments(this._popupComments);
    render(this._popupComponent.getElement().querySelector('.film-details__comments-list'), this._commentsComponent, RenderPosition.AFTERBEGIN);
    this._commentsComponent.setDeleteCommentHandler(this._deleteCommentHandler);
  }

  _handleModelPopupEvent(updateType) {
    switch(updateType) {
      case UPDATE_TYPE.CHANGE_FILM_DATA:
        this.init();
        break;
    }
  }

  _searchFilmDataForPopup() {
    this._popupCurrentFilm = this._filmsModel.getFilms().find((fl) => fl.id === this._filmUNID);
    this._commentsModel.setComments(UPDATE_TYPE.INIT_COMMENTS, this._filmUNID);
  }

  _openPopupClickHandler(filmUNID) {
    this._filmUNID = filmUNID;
    this._searchFilmDataForPopup();
    this.init();
  }

  _generatePopupComponent() {
    this._popupComponent = new PopupView(this._popupCurrentFilm);
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
    this._popupCurrentFilm.userDetails.watchlist = !this._popupCurrentFilm.userDetails.watchlist;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm);
  }

  _handleWatchedClick() {
    this._popupCurrentFilm.userDetails.alreadyWatched = !this._popupCurrentFilm.userDetails.alreadyWatched;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm);
  }

  _handleFavoriteClick() {
    this._popupCurrentFilm.userDetails.favorite = !this._popupCurrentFilm.userDetails.favorite;
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm);
  }

  _addCommentHandler() {
    const film = this._popupCurrentFilm;
    const newComment = generateComment(this._commentText, this._commentEmotion);
    film.comments.push(newComment.id);
    this._commentsModel.addComment(UPDATE_TYPE.ADD_COMMENT, newComment, this._filmUNID);
    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, film);
  }

  _deleteCommentHandler(commentUNID) {
    // console.log(commentUNID);
    this._popupCurrentFilm.comments.splice(this._popupComments.indexOf(this._popupComments.find((com) => com === commentUNID)), 1);
    this._commentsModel.deleteComment(UPDATE_TYPE.DELETE_COMMENT, this._popupComments.find((com) => com.id === commentUNID));

    this._filmsModel.updateFilm(UPDATE_TYPE.CHANGE_FILM_DATA, this._popupCurrentFilm);
  }
}
