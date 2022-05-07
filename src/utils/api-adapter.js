export const adaptFilmsForClient = (film) => ({
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
});

export const adaptFilmsForServer = (film) => ({
  'id': film['id'],
  'comments': film['comments'],
  'film_info': {
    'title': film['filmInfo']['title'],
    'alternative_title': film['filmInfo']['alternativeTitle'],
    'total_rating': film['filmInfo']['totalRating'],
    'poster': film['filmInfo']['poster'],
    'age_rating': film['filmInfo']['ageRating'],
    'director': film['filmInfo']['director'],
    'writers': film['filmInfo']['writers'],
    'actors': film['filmInfo']['actors'],
    'release': {
      'date': film['filmInfo']['release']['date'],
      'release_country': film['filmInfo']['release']['releaseCountry'],
    },
    'runtime': film['filmInfo']['runtime'],
    'genre': film['filmInfo']['genre'],
    'description': film['filmInfo']['description'],
  },
  'user_details': {
    'watchlist': film['userDetails']['watchlist'],
    'already_watched': film['userDetails']['alreadyWatched'],
    'watching_date': film['userDetails']['watchingDate'],
    'favorite': film['userDetails']['favorite'],
  },
});
