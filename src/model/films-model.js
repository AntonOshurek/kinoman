import AbstractObserver from '../utils/abstract-observer';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
    this._comments = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  setComments(comments) {
    this._comments = comments;
  }

  getFilms() {
    return this._films;
  }

  getComments() {
    return this._comments;
  }
}
