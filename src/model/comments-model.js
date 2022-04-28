import AbstractObserver from '../utils/abstract-observer';

export default class FilmsModel extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  updateComments(updateType, update) {
    this._comments.push(update);
    this._notify(updateType, update);
  }
}
