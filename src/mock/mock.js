import { fishText } from '../../node_modules/fish-text/fish-text.js';
import { getRandomInt, getUNID } from '../utils/utils';

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const GENRE = [
  'Action',
  'Western film',
  'gangster movie',
  'Detective',
  'Drama',
  'Historical film',
  'Comedy',
  'Melodrama',
  'musical film',
  'noir',
  'political film',
  'adventure movie',
  'Fairy tale',
  'Tragedy',
  'Tragicomedy',
];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const getRandomPoster = () => {
  const filmPoster = POSTERS[getRandomInt(0, POSTERS.length - 1)];
  return filmPoster;
};

const getComments = () => {
  // eslint-disable-next-line prefer-const
  let comments = [];
  for(let i = 0; i < getRandomInt(1, 12); i++) {
    comments.push({
      'id': getUNID(),
      'author': fishText.getNames({count: 1, type: 'full', lang: 'eng', dataType: 'string'}),
      'comment': fishText.getRandomRangeWords({min: 3, max: 12, dataType: 'string', lang: 'eng', repeat: false}),
      'emotion': EMOTIONS[getRandomInt(0, EMOTIONS.length - 1)],
    });
  }
  return comments;
};

export const generateFilm = () => ({
  title: fishText.getRandomRangeWords({min: 1, max: 4, dataType: 'string', lang: 'eng', repeat: false}),
  description: fishText.getRandomRangeWords({min: 10, max: 25, dataType: 'string', lang: 'eng', repeat: false}),
  poster: getRandomPoster(),
  rating: `${getRandomInt(1, 9)  }.${  getRandomInt(0, 9)}`,
  year: getRandomInt(1940, 2010),
  genre: GENRE[getRandomInt(0, GENRE.length - 1)],
  comments: getComments(),
});
