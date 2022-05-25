// import { adaptFilmsForClient } from './utils/api-adapter';
import { Method, SuccessHTTPStatusRange } from './utils/constants';

export default class ApiComments {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getComments(filmId) {
    return this._load({url: 'comments', id: filmId})
      .then(ApiComments.toJSON);
  }

  _load({
    url,
    id,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._autorization);

    return fetch(`${this._endPoint}/${url}/${id}`, {method, body, headers})
      .then(ApiComments.checkStatus)
      .catch(ApiComments.catchError);
  }

  deleteComment(comment) {
    return this._load({
      url: 'comments',
      id: comment.id,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiComments.toJSON);
  }

  addComment(comment, filmUNID) {
    return this._load({
      url: 'comments',
      id: filmUNID,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiComments.toJSON);
  }

  static checkStatus(response) {
    if(response.status < SuccessHTTPStatusRange.MIN ||
    response.status > SuccessHTTPStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
