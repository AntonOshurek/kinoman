import { adaptFilmsForClient, adaptFilmsForServer } from './utils/api-adapter';
import { Method, SuccessHTTPStatusRange } from './utils/constants';

export default class ApiFilms {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getFilms() {
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

  updateFilm(film) {
    const updateFilm = adaptFilmsForServer(film);
    // console.log(updateFilm);
    return this._load({
      url: `movies/${updateFilm.id}`,
      method: Method.PUT,
      body: JSON.stringify(updateFilm),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiFilms.toJSON);
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
