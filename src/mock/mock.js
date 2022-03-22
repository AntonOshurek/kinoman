import { fishText } from '../../node_modules/fish-text/fish-text.js';
import { getRandomInt } from '../utils/utils';

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const getRandomPoster = () => {
  const filmPoster = POSTERS[getRandomInt(0, POSTERS.length - 1)];
  return filmPoster;
};

export const generateFilm = () => ({
  title: fishText.getRandomRangeWords({min: 1, max: 4, dataType: 'string', lang: 'eng', repeat: false}),
  description: fishText.getRandomRangeWords({min: 10, max: 25, dataType: 'string', lang: 'eng', repeat: false}),
  poster: getRandomPoster(),
});
