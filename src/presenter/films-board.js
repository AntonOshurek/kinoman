import { render, remove } from '../utils/render';
import { sortFilmsByField, updateItem, filter } from '../utils/common';
import { RenderPosition, SITE_MAIN, FILMS_COUNT_PER_STEP, SORT_FIELDS, COMMENTED_FILMS_COUNT, TOP_FILMS_COUNT, FILM_TYPE, NAVIGATION_FIELDS, USER_ACTION, UPDATE_TYPE } from '../utils/constants';

import SortView from '../view/sort';
import FilmsView from '../view/films';
import FilmsListView from '../view/films-list';
import FilmsListTopView from '../view/films-list-top';
import FilmsListCommentedView from '../view/films-list-commented';
import LoadMoreButtonView from '../view/loadMoreButton';
import FilmsListTitleView from '../view/filmsListTitle';

// import PopupPresenter from './popup-presenter';
import FilmPresenter from './film-presenter';
// import NavigationPresenter from './navigation-presenter';

export default class FilmsBoardPresenter {
  constructor(filmsModel, navigationModel) {
    this._filmsModel = filmsModel;
    this._navigationModel = navigationModel;
    // this._sourceDataArray = [];
    // this._sourceCommentsArray = [];
    //data variables for using
    // this._defaultFilmsArray = [];
    // this._sortFilmsArray = [];
    //basic variables
    this._dataLength = null;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    // this._currentFilter = null;
    // this._currentMenu = null;
    // this._currentMenuData = null;
    // films presenters arrays
    this._mainFilmPresenters = new Map();
    this._topFilmPresenters = new Map();
    this._commentedFilmPresenters = new Map();
    //views
    this._sortFilmsView = null;
    this._siteFilmsView = new FilmsView();
    this._filmsListView = new FilmsListView();
    this._filmsListTopView = new FilmsListTopView();
    this._filmsListCommentedView = new FilmsListCommentedView();
    this._loadMoreButtonView = new LoadMoreButtonView();
    this._FilmsListTitleView = null;
    //binding
    // this._showFilmsListByCurrentMenu = this._showFilmsListByCurrentMenu.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    // this._handleFilmChange = this._handleFilmChange.bind(this);
    // this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
    // this._setpopupStatus = this._setpopupStatus.bind(this);
    //presenters
    // this._PopupPresenter = new PopupPresenter(this._handleFilmChange, this._setpopupStatus);
    // this._navigationPresenter = new NavigationPresenter(this._showFilmsListByCurrentMenu);


    this._handleFilmAction = this._handleFilmAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

  }

  init() {

    this._dataLength = this._filmsModel.getFilms().length;
    this._filmsModel.addObserver(this._handleModelEvent);

    // this._sourceDataArray = [...filmsData];
    // this._sourceCommentsArray = [...commentsData];
    // this._defaultFilmsArray = this._sourceDataArray;
    //sort data
    // this._sortFilmsArray = this._sourceDataArray;
    this._currentSortField = SORT_FIELDS.DEFAULT;
    this._currentNavigationField = NAVIGATION_FIELDS.ALL;
    //menu data
    // this._currentMenuData = this._sourceDataArray;
    // this._currentMenuField = MENU_FIELDS.ALL;
    //popup data
    // this._popupFilmUNID = null;
    // this._popupFilmData = null;
    // this._popupFilmComments = null;
    // this._popupStatus = false;

    // this._navigationPresenter.init(this._sortFilmsArray);
    render(SITE_MAIN, this._siteFilmsView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListTopView, RenderPosition.BEFOREEND);
    render(this._siteFilmsView, this._filmsListCommentedView, RenderPosition.BEFOREEND);
    //search containers for films rendering
    this._siteFilmsListContainer = this._filmsListView.getElement().querySelector('.films-list__container--main');
    this._siteTopFilmContainer = this._filmsListTopView.getElement().querySelector('.films-list__container--top');
    this._siteCommentedFilmContainer = this._filmsListCommentedView.getElement().querySelector('.films-list__container--commented');

    // this._siteFilmsView.setOpenPopupClikHandler(this._openPopupClickHandler);

    this._renderFilmsBoard();
    this._dataLength > 0 ? this._renderTopFilms() : null;
  }

  _getFilms() {
    this._currentNavigationField = this._navigationModel.getNavigationField();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._currentNavigationField](films);

    if(this._currentSortField === SORT_FIELDS.DEFAULT) {
      return filtredFilms;
    } else {
      return sortFilmsByField(filtredFilms, this._currentSortField);
    }
  }

  _getComments() {
    return this._filmsModel._getComments();
  }

  _handleFilmAction(userAction, updateType, update) {
    switch (userAction) {
      case USER_ACTION.ADD_TO_USER_LIST:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._mainFilmPresenters.get(data.id) ? this._mainFilmPresenters.get(data.id).init(data) : null;
        this._topFilmPresenters.get(data.id) ? this._topFilmPresenters.get(data.id).init(data) : null;
        this._commentedFilmPresenters.get(data.id) ? this._commentedFilmPresenters.get(data.id).init(data) : null;
        //add update popup when it have open status
        break;
      case UPDATE_TYPE.MINOR:
        // this.#clearBoard();
        // this.#renderBoard();
        break;
      // case UpdateType.MAJOR:
      //   // this.#clearBoard({resetRenderedTaskCount: true, resetSortType: true});
      //   // this.#renderBoard();
      //   break;
    }
  }

  _handleSortTypeChange(sortField) {
    if(sortField !== this._currentSortField) {
      this._currentSortField = sortField;
      this._clearFilmsBoard({resetRenderedFilmsCount: true});
      this._renderFilmsBoard();
    }
  }

  _renderSort() {
    this._sortFilmsView = new SortView(this._currentSortField);
    render(SITE_MAIN, this._sortFilmsView, RenderPosition.BEFOREBEGIN);

    this._sortFilmsView.setSortClickHandler(this._handleSortTypeChange);
  }

  _renderTopFilms() {
    const topFilmsArray = sortFilmsByField(this._filmsModel.getFilms(), SORT_FIELDS.RATING, TOP_FILMS_COUNT);
    topFilmsArray.map((film) => this._renderFilm(film, this._siteTopFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.TOP));

    const commentedFilmsArray = sortFilmsByField(this._filmsModel.getFilms(), SORT_FIELDS.COMMENTS, COMMENTED_FILMS_COUNT);
    commentedFilmsArray.map((film) => this._renderFilm(film, this._siteCommentedFilmContainer, RenderPosition.BEFOREEND, FILM_TYPE.COMMENTED));
  }

  _renderNoFilms() {
    this._FilmsListTitleView ? remove(this._FilmsListTitleView) : null;
    this._clearFilmsBoard();
    this._FilmsListTitleView = new FilmsListTitleView(this._currentMenu);
    render(this._siteFilmsListContainer, this._FilmsListTitleView, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, place, position, filmType = FILM_TYPE.MAIN) {
    const oneFilmPresenter = new FilmPresenter(position, place, this._handleFilmAction);
    oneFilmPresenter.init(film);

    filmType === FILM_TYPE.MAIN ? this._mainFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.TOP ? this._topFilmPresenters.set(film.id, oneFilmPresenter) : null;
    filmType === FILM_TYPE.COMMENTED ? this._commentedFilmPresenters.set(film.id, oneFilmPresenter) : null;
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._siteFilmsListContainer, RenderPosition.BEFOREEND));
  }

  _renderLoadMoreButton() {
    this._loadMoreButtonView.getElement() ? render(this._filmsListView, this._loadMoreButtonView, RenderPosition.BEFOREEND) : null;

    this._loadMoreButtonView.setPaginationClickHandler(() => {
      const films = this._getFilms().slice(this._renderedFilmsCount, Math.min(this._dataLength, this._renderedFilmsCount + FILMS_COUNT_PER_STEP));
      this._renderFilms(films);

      this._renderedFilmsCount += FILMS_COUNT_PER_STEP;
      this._renderedFilmsCount >= this._dataLength ? remove(this._loadMoreButtonView) : null;
    });
  }

  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    this._mainFilmPresenters.forEach((film) => film.destroy());
    this._mainFilmPresenters.clear();

    remove(this._sortFilmsView);
    remove(this._loadMoreButtonView);

    if (this._FilmsListTitleView) {
      remove(this._FilmsListTitleView);
    }

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(this._dataLength, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortField = SORT_FIELDS.DEFAULT;
    }
  }

  _renderFilmsBoard() {
    if (this._dataLength === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    this._renderFilms(this._getFilms().slice(0, Math.min(this._dataLength, this._renderedFilmsCount)));
    this._dataLength > this._renderedFilmsCount ? this._renderLoadMoreButton() : null;
  }
}


// _searchFilmDataForPopup() {
//   this._popupFilmData = this._defaultFilmsArray.find((film) => film.id === this._popupFilmUNID);
//   this._popupFilmComments = this._popupFilmData.comments.map((commentID) => this._sourceCommentsArray.find((com) => (com.id === commentID)));
// }

// _setpopupStatus(status) {
//   this._popupStatus = status;
// }

// _openPopupClickHandler(filmUNID) {
//   this._popupFilmUNID = filmUNID;
//   this._searchFilmDataForPopup();
//   this._PopupPresenter.init(this._popupFilmData, this._popupFilmComments);
// }

// _showFilmsListByCurrentMenu(sortData, currentMenu) {
//   this._currentMenuField = currentMenu;
//   this._currentMenuData = sortData;
//   this._sortFilmsArray = sortData;
//   this._resetSort();
//   this._renderFilmsBoard();
// }

// _handleFilmChange(updatedFilm) {
//   this._defaultFilmsArray = updateItem(this._defaultFilmsArray, updatedFilm);
//   this._sortFilmsArray = this._defaultFilmsArray;

//   this._mainFilmPresenters.get(updatedFilm.id) ? this._mainFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
//   this._topFilmPresenters.get(updatedFilm.id) ? this._topFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;
//   this._commentedFilmPresenters.get(updatedFilm.id) ? this._commentedFilmPresenters.get(updatedFilm.id).init(updatedFilm) : null;

//   this._navigationPresenter.init(this._sortFilmsArray);
//   if(this._popupStatus) {
//     this._searchFilmDataForPopup();
//     this._PopupPresenter.init(this._popupFilmData, this._popupFilmComments);
//   }
// }

// _sortFilms() {
//   if(this._currentSortField === SORT_FIELDS.DEFAULT) {
//     this._currentMenuField === MENU_FIELDS.ALL ? this._sortFilmsArray = this._defaultFilmsArray : this._sortFilmsArray = this._currentMenuData;
//   } else {
//     this._sortFilmsArray = sortFilmsByField(this._sortFilmsArray, this._currentSortField);
//   }
// }
