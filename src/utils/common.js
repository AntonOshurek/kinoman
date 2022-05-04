import { SORT_FIELDS, NAVIGATION_FIELDS } from './constants';
import { fishText } from '../../node_modules/fish-text/fish-text.js';
import { getNowDate } from './date';

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

export const generateComment = (commentText, commentEmoji) => ({
  'id': getUNID(),
  'author': fishText.getNames({count: 1, type: 'full'}),
  'comment': commentText,
  'date': getNowDate(),
  'emotion': commentEmoji,
});

export const filter = {
  [NAVIGATION_FIELDS.ALL]: (films) => films.filter((film) => film),
  [NAVIGATION_FIELDS.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite === true ),
  [NAVIGATION_FIELDS.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist === true ),
  [NAVIGATION_FIELDS.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched === true),
  [NAVIGATION_FIELDS.STATS]: (films) => films.filter((film) => film),
};

export function sortFilmsByField (dataArray, field, count = 0) {
  let result;
  if(field === SORT_FIELDS.RATING) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2.filmInfo[field] - item1.filmInfo[field]);
  }
  if(field === SORT_FIELDS.COMMENTS) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2[field].length - item1[field].length);
  }
  if(field === SORT_FIELDS.DATE) {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => {
      if (item1.filmInfo.release.date < item2.filmInfo.release.date) {
        return 1;
      }
      if (item1.filmInfo.release.date > item2.filmInfo.release.date) {
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
