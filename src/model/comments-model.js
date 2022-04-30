import AbstractObserver from '../utils/abstract-observer';

export default class CommentsModel extends AbstractObserver {
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

  deleteComment(updateType, deletedComment) {
    const deletedCommentIndex = this._comments.indexOf(deletedComment);
    this._comments.splice(deletedCommentIndex, 1);
    this._notify(updateType, deletedComment);
  }

  addComment(updateType, update) {
    this._comments.push(update);
    this._notify(updateType, update);
  }
}
