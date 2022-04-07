import PopupView from '../view/popup';

import { SITE_BODY, SITE_MAIN, RenderPosition } from '../utils/constants';
import { remove, render } from '../utils/render';
import { onEscKeyDown } from '../utils/common';

export default class PopupPresenter {
  constructor() {
    this._popupComponent = null;
    this._siteFilmsView = null;
    this._defaultFilmsArray = [];
    this._commentsArray = [];

    this._openPopup = this._openPopup.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(defaultFilmsArray, commentsArray, siteFilmsView) {
    this._defaultFilmsArray = defaultFilmsArray;
    this._commentsArray = commentsArray;
    this._siteFilmsView = siteFilmsView;

    this._siteFilmsView.setOpenPopupClikHandler(this._openPopup);
  }

  _closePopup() {
    SITE_BODY.classList.remove('hide-overflow');
    remove(this._popupComponent);
    this._popupComponent = null;
    document.removeEventListener('keydown', onEscKeyDown);
    this._siteFilmsView.setOpenPopupClikHandler(this._openPopup);
  }

  _openPopup(evt) {
    if(evt.target.closest('.film-card__poster')) {
      const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
      //search current film
      const currentFilm = this._defaultFilmsArray.find((film) => film.id === filmUNID);
      //search film comments
      const currentFilmComments = currentFilm.comments.map((commentID) => this._commentsArray.find((com) => (com.id === commentID)));
      // generate popup markup
      this._popupComponent = new PopupView(currentFilm, currentFilmComments);
      //show popup
      render(SITE_MAIN, this._popupComponent, RenderPosition.BEFOREEND);

      this._popupComponent.setPopupMenuButtonsHandler(this._PopupMenuButtonsHandler);

      SITE_BODY.classList.add('hide-overflow'); //hide scroll
      this._siteFilmsView.removeOpenPopupClikHandler();
      //listeners for closed popup
      this._popupComponent.setClosePopupButtonClickHandler(this._closePopup);
      document.addEventListener('keydown', () => onEscKeyDown(evt, this._closePopup()));
    }
  }

  _PopupMenuButtonsHandler(evt) {
    if(evt.target.tagName === 'BUTTON') {
      // const buttonName = evt.target.name;
    }
  }
}