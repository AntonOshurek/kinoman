const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getTasks() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((tasks) => tasks.map(Api.adaptFilmsForClient));
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._autorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static adaptFilmsForClient(film) {
    return {
      'id': film['id'],
      'comments': film['comments'],
      'filmInfo': {
        'title': film['film_info']['title'],
        'alternativeTitle': film['film_info']['alternative_title'],
        'totalRating': film['film_info']['total_rating'],
        'poster': film['film_info']['poster'],
        'ageRating': film['film_info']['age_rating'],
        'director': film['film_info']['director'],
        'writers': film['film_info']['writers'],
        'actors': film['film_info']['actors'],
        'release': {
          'date': film['film_info']['release']['date'],
          'releaseCountry': film['film_info']['release']['release_country'],
        },
        'runtime': film['film_info']['runtime'],
        'genre': film['film_info']['genre'],
        'description': film['film_info']['description'],
      },
      'userDetails': {
        'watchlist': film['user_details']['watchlist'],
        'alreadyWatched': film['user_details']['already_watched'],
        'watchingDate': film['user_details']['watching_date'],
        'favorite': film['user_details']['favorite'],
      },
    };
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
