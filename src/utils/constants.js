export const FILMS_COUNT = 8;

export const COMMENTED_FILMS_COUNT = 2;

export const TOP_FILMS_COUNT = 2;

export const FILMS_COUNT_PER_STEP = 5;

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const SORT_FIELDS = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'total_rating',
  COMMENTS: 'comments',
};

export const NAVIGATION_FIELDS = {
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
  ALL: 'all',
};

export const FILM_TYPE = {
  MAIN: 'main',
  TOP: 'top',
  COMMENTED: 'commented',
};

export const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  NAVIGATION: 'NAVIGATION',
  ADD_COMMENT: 'ADD_COMMENT',
  CHANGE_FILM_DATA: 'CHANGE_FILM_DATA',
};

//site blocks
export const SITE_BODY = document.querySelector('.body');
export const SITE_HEADER = document.querySelector('.header');
export const SITE_MAIN = document.querySelector('.main');
export const SITE_FOOTER_STATISTICS = document.querySelector('.footer__statistics');
