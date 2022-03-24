import dayjs from 'dayjs';

export const getRandomInt = (minValue, maxValue) => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

export const getUNID = () => (
  Date.now().toString(36) + Math.random().toString(36).substr(2)
);

export function sortFilmsByField (dataArray, field) {
  if(field === 'total_rating') {
    const result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2.film_info[field] - item1.film_info[field]);
    return result.slice(0, 2);
  }
  if(field === 'comments') {
    const result = JSON.parse(JSON.stringify(dataArray)).sort((item1, item2) => item2[field].length - item1[field].length);
    return result.slice(0, 2);
  }
}

export const generateRandomDate = (range) => {
  const bar = getRandomInt(0, range);
  return dayjs().add(bar, 'day').toDate();
};

export const booleanGenerate = () => (
  Boolean(getRandomInt(0, 1))
);
