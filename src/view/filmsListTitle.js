import AbstractView from './abstract-view';

const createFilmsListTitleTemplate = (title) =>`
    <h2 class="films-list__title">${title}</h2>
`;

export default class FilmsListTitle extends AbstractView {
  constructor(viewName) {
    super();

    this._viewName = viewName;
    this._title = null;
    this._generateTitle();
  }

  _generateTitle() {
    if(!this._viewName) {
      this._title = 'There are no movies in our database';
    } else {
      switch(this._viewName) {
        case 'all':
          this._title = 'There are no movies in our database';
          break;
        case 'watchlist':
          this._title = 'There are no movies to watch now';
          break;
        case 'history':
          this._title = 'There are no watched movies now';
          break;
        case 'favorites':
          this._title = 'There are no favorite movies now';
          break;
      }
    }
  }

  getTemplate() {
    return createFilmsListTitleTemplate(this._title);
  }
}
//   * All movies – 'There are no movies in our database'
//   * Watchlist — 'There are no movies to watch now';
//   * History — 'There are no watched movies now';
//   * Favorites — 'There are no favorite movies now'.
