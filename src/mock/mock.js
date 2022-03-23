import { fishText } from '../../node_modules/fish-text/fish-text.js';
import dayjs from 'dayjs';
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
      'author': fishText.getNames({count: 1, type: 'full'}),
      'comment': fishText.getRandomRangeWords({min: 3, max: 12}),
      'emotion': EMOTIONS[getRandomInt(0, EMOTIONS.length - 1)],
    });
  }
  return comments;
};

// export const generateFilm = () => ({
//   title: fishText.getRandomRangeWords({min: 1, max: 4}),
//   description: fishText.getRandomRangeWords({min: 10, max: 25}),
//   poster: getRandomPoster(),
//   rating: `${getRandomInt(1, 9)  }.${  getRandomInt(0, 9)}`,
//   year: getRandomInt(1940, 2010),
//   genre: GENRE[getRandomInt(0, GENRE.length - 1)],
//   comments: getComments(),
// });

const generateRandomDate = () => {
  const bar = getRandomInt(0, -26000);
  return dayjs().add(bar, 'day').toDate();
};

export const generateFilm = () => ({
  'id': '0',
  'comments': getComments(),
  'film_info': {
    'title': fishText.getRandomRangeWords({min: 1, max: 4}),
    'altertive_title': fishText.getRandomRangeWords({min: 4, max: 6}),
    'total_rating': `${getRandomInt(1, 9)  }.${  getRandomInt(0, 9)}`,
    'poster': getRandomPoster(),
    'age_rating': getRandomInt(0, 18),
    'director': fishText.getNames({count: 1, type: 'full'}),
    'writers': [
      fishText.getNames({count: 1, type: 'full'}),
    ],
    'actors': [
      fishText.getNames({count: 1, type: 'full'}),
      fishText.getNames({count: 1, type: 'full'}),
      fishText.getNames({count: 1, type: 'full'}),
    ],
    'release': {
      'date': generateRandomDate(),
      'release_country': fishText.getCountries({}),
    },
    'runtime': getRandomInt(40, 180),
    'genre': [
      GENRE[getRandomInt(0, GENRE.length - 1)],
    ],
    'description': fishText.getRandomRangeWords({min: 10, max: 25}),
    'user_details': {
      'watchlist': false,
      'already_watched': true,
      'watching_date': generateRandomDate(),
      'favorite': false,
    },
  },
});
