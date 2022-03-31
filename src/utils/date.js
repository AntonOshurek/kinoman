import dayjs from 'dayjs';
import { getRandomInt } from './common';

export const dateFormater = (date) => dayjs(date).format('DD MMMM YYYY');

export const generateRandomDate = (range) => {
  const bar = getRandomInt(0, range);
  return dayjs().add(bar, 'day').toDate();
};
