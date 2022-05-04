import AbstractObserver from '../utils/abstract-observer';

import ApiComments from '../api-comments';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
    this._apiComments = new ApiComments('https://17.ecmascript.pages.academy/cinemaddict', 'Basic fjkdskl843aldsDF3');
  }

  setComments(updateType, filmId) {
    this._apiComments.getComments(filmId).then((comments) => {
      this._comments = comments;
      this._notify(updateType);
    });
  }

  getComments() {
    return this._comments;
  }

  deleteComment(updateType, deletedComment) {
    this._comments.splice(this._comments.indexOf(deletedComment), 1);
    this._notify(updateType, deletedComment);
  }

  addComment(updateType, update) {
    this._comments.push(update);
    this._notify(updateType, update);
  }
}
