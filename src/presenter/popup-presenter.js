import PopupView from '../view/popup';

export default class PopupPresenter {
  constructor() {
    this.popupComponent = null;
  }

  _closePopup() {
    SITE_BODY.classList.remove('hide-overflow');
    remove(popupComponent);
    popupComponent = null;
    document.removeEventListener('keydown', onEscKeyDown);
    siteFilmsView.setOpenPopupClikHandler(openPopup);
  }

  _openPopup(evt) {
    if(evt.target.closest('.film-card')) {
      //search current film
      const filmUNID = evt.target.closest('.film-card').getAttribute('data-unid');
      const currentFilm = defaultFilmsArray.find((film) => film.id === filmUNID);
      //generate popup markup
      popupComponent = new PopupView(currentFilm, commentsArray);
      //show popup
      render(SITE_MAIN, popupComponent, RenderPosition.BEFOREEND);

      SITE_BODY.classList.add('hide-overflow'); //hide scroll
      siteFilmsView.removeOpenPopupClikHandler();
      //listeners for closed popup
      popupComponent.setClosePopupButtonClickHandler(closePopup);
      document.addEventListener('keydown', () => onEscKeyDown(evt, closePopup()));
    }
  }
}
