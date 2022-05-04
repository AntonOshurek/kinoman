import AbstractView from './abstract-view';

import { dateFormater } from '../utils/date';
import he from 'he';

const createCommentsTemplate = (comments) => `
  <ul class="film-details__comments-list">
    ${comments.map((comment) => `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          ${comment.emotion ? `<img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">` : ''}
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${dateFormater(comment.date)}</span>
            <button class="film-details__comment-delete" data-comment-id='${comment.id}'>Delete</button>
          </p>
        </div>
      </li>
      `)}
  </ul>
  `;

export default class FilmComments extends AbstractView {
  constructor(comments) {
    super();

    this._comments = comments;
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  _deleteCommentHandler(evt) {
    if(evt.target.tagName === 'BUTTON') {
      evt.preventDefault();
      const commentUNID = evt.target.getAttribute('data-comment-id');
      this._callback.deleteCommentHandler(commentUNID);
    }
  }

  setDeleteCommentHandler(callback) {
    this._callback.deleteCommentHandler = callback;
    this.getElement().addEventListener('click', this._deleteCommentHandler);
  }
}
