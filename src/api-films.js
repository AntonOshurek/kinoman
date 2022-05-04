import { adaptFilmsForClient } from './utils/api-adapter';
import { Method, SuccessHTTPStatusRange } from './utils/constants';

export default class ApiFilms {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getTasks() {
    return this._load({url: 'movies'})
      .then(ApiFilms.toJSON)
      .then((tasks) => tasks.map(adaptFilmsForClient));
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._autorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(ApiFilms.checkStatus)
      .catch(ApiFilms.catchError);
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
