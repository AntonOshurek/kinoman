import AbstractObserver from '../utils/abstract-observer';
import ApiComments from '../api-comments';

import { AUTORIZATION, END_POINT } from '../utils/constants';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
    this._apiComments = new ApiComments(END_POINT, AUTORIZATION);
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
    this._apiComments.deleteComment(deletedComment).then(() => {
      this._comments.splice(this._comments.indexOf(deletedComment), 1);
      this._notify(updateType, deletedComment);
    });
  }

  addComment(updateType, update, filmUNID) {
    this._apiComments.addComment(update, filmUNID).then(() => {
      this._comments.push(update);
      this._notify(updateType, update);
    });
  }
}
