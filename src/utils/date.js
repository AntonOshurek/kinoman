import dayjs from 'dayjs';
import { getRandomInt, getZero } from './common';

export const dateFormater = (date) => dayjs(date).format('DD MMMM YYYY');

export const generateRandomDate = (range) => {
  const bar = getRandomInt(0, range);
  return dayjs().add(bar, 'day').toDate();
};

export const transformRuntime = (time) => {
  const mins = time % 60;
  const hours = (time - mins) / 60;

  let rezult;

  if(hours === 0) {
    rezult =  `${getZero(mins)}m`;
  } else {
    rezult = `${getZero(hours)}h ${getZero(mins)}m`;
  }

  return rezult;
};
