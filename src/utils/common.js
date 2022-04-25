import { SORT_FIELDS, NAVIGATION_FIELDS } from './constants';

export const getRandomInt = (minValue, maxValue) => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

export const getUNID = () => (
  Date.now().toString(36) + Math.random().toString(36).substr(2)
);

export const booleanGenerate = () => (
  Boolean(getRandomInt(0, 1))
);

export const getZero = (num) => {
  if (num >= 0 && num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
};

export const filter = {
  [NAVIGATION_FIELDS.ALL]: (films) => films.filter((film) => film),
  [NAVIGATION_FIELDS.FAVORITES]: (films) => films.filter((film) => film.user_details.favorite === true ),
  [NAVIGATION_FIELDS.WATCHLIST]: (films) => films.filter((film) => film.user_details.watchlist === true ),
  [NAVIGATION_FIELDS.HISTORY]: (films) => films.filter((film) => film.user_details.already_watched === true),
  [NAVIGATION_FIELDS.STATS]: (films) => films.filter((film) => film),
};

export function sortFilmsByField (dataArray, field, count = 0) {
  let result;
  if(field === SORT_FIELDS.RATING) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2.film_info[field] - item1.film_info[field]);
  }
  if(field === SORT_FIELDS.COMMENTS) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2[field].length - item1[field].length);
  }
  if(field === SORT_FIELDS.DATE) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => {
      if (item1.film_info.release.date < item2.film_info.release.date) {
        return 1;
      }
      if (item1.film_info.release.date > item2.film_info.release.date) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    });
  }

  if(count !== 0) {
    return result.slice(0, count);
  } else {
    return result;
  }
}
