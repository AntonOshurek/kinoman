import AbstractView from './abstract-view';
import { dateFormater } from '../utils/date';

const createpopupTemplate = (filmData, commentsArray) => {
  const {film_info: filmInfo, user_details: userDetails } = filmData;
  const {watchlist, already_watched: alredyWatched, favorite} = userDetails;

  const generateFilmComments = () => {
    let commentsMarkup = '';

    commentsArray.map((comment) => {
      commentsMarkup += `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">I${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${dateFormater(comment.date)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
      `;
    });
    return commentsMarkup;
  };

  const generateGeneresTemplates = () => {
    let generesItem = '';
    const GenresTitle = filmInfo.genre.length > 1 ? 'Genres' : 'Genre';
    filmInfo.genre.forEach((gen, i) => {
      generesItem += `
        <span class="film-details__genre">${gen} ${i === filmInfo.genre.length - 1 ? '.' : ', '}</span>
      `;
    });

    const generesTemplate = `
      <td class="film-details__term">${GenresTitle}</td>
      <td class="film-details__cell">
        ${generesItem}
      </td>
    `;
    return generesTemplate;
  };

  return `
  <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.age_rating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.altertive_title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.total_rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateFormater(filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmInfo.runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.release_country}</td>
            </tr>
            <tr class="film-details__row">
              ${generateGeneresTemplates()}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${alredyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsArray.length}</span></h3>

        <ul class="film-details__comments-list">
          ${generateFilmComments()}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>
  `;
};

export default class Popup extends AbstractView {
  constructor(filmData, commentsArray) {
    super();

    this._filmData = filmData;
    this._commentsArray = commentsArray;

    // this._menuButtonsBlock = this.getElement().querySelector('.film-details__controls');

    this._closePopupButtonClickHandler = this._closePopupButtonClickHandler.bind(this);
    // this._popupMenuButtonsHandler = this._popupMenuButtonsHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createpopupTemplate(this._filmData, this._commentsArray);
  }

  //  film-details__control-button--watchlist
  //  film-details__control-button--watched
  //  film-details__control-button--favorite

  _closePopupButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupButtonClick(evt);
  }

  setClosePopupButtonClickHandler(callback) {
    this._callback.closePopupButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupButtonClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClickHandler(evt);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClickHandler(evt);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClickHandler(evt);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClickHandler = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClickHandler = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClickHandler = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  // _popupMenuButtonsHandler(evt) {
  //   evt.preventDefault();
  //   this._callback.popupMenuButtonsClick(evt);
  // }

  // setPopupMenuButtonsHandler(callback) {
  //   this._callback.popupMenuButtonsClick = callback;
  //   this._menuButtonsBlock.addEventListener('click', this._popupMenuButtonsHandler);
  // }
}
