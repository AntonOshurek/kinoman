import FilmView from '../view/film';
import { render, remove, replace } from '../utils/render';

export default class FilmPresenter {
  constructor(position, place, handleFilmChange) {
    this._filmView = null;
    this._filmData = null;

    this._renderPosition = position;
    this._renderPlace = place;
    this._handleFilmChange = handleFilmChange;
  }

  init(filmData) {
    this._filmData = filmData;

    const prevFilmComponent = this._filmView;

    this._filmView = new FilmView(this._filmData);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._filmView.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmView.setWatchedClickHandler(this._handleWatchedClick);
    this._filmView.setFavoriteClickHandler(this._handleFavoriteClick);

    if(prevFilmComponent === null) {
      this._renderFilm();
    } else {
      replace(this._filmView, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  _renderFilm() {
    render(this._renderPlace, this._filmView, this._renderPosition);
  }

  destroy() { //  ?????
    remove(this._filmView);
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
