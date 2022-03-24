import dayjs from 'dayjs';

export const getRandomInt = (minValue, maxValue) => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

export const getUNID = () => (
  Date.now().toString(36) + Math.random().toString(36).substr(2)
);

export function sortFilmsByField (dataArray, field, count = 0) {
  let result;
  if(field === 'total_rating') {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2.film_info[field] - item1.film_info[field]);
  }
  if(field === 'comments') {
    result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2[field].length - item1[field].length);
  }
  if(field === 'date') {
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

export const generateRandomDate = (range) => {
  const bar = getRandomInt(0, range);
  return dayjs().add(bar, 'day').toDate();
};

export const booleanGenerate = () => (
  Boolean(getRandomInt(0, 1))
);
