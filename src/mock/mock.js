import { fishText } from '../../node_modules/fish-text/fish-text.js';
import { getRandomInt, getUNID, booleanGenerate } from '../utils/common';
import { generateRandomDate } from '../utils/date.js';

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

const commentsArray = [];
const commentsUNIDArray = [];

const COMMENTS_COUNT = 1000;

for(let i = 0; i < COMMENTS_COUNT; i++) {
  commentsUNIDArray.push(getUNID());
}

const generateComment = (unid) => (
  {
    'id': unid,
    'author': fishText.getNames({count: 1, type: 'full'}),
    'comment': fishText.getRandomRangeWords({min: 3, max: 12}),
    'date': generateRandomDate(-5000),
    'emotion': EMOTIONS[getRandomInt(0, EMOTIONS.length - 1)],
  }
);

for(let i = 0; i < COMMENTS_COUNT; i++) {
  const commentUNID = commentsUNIDArray[i];
  const getOneComment = generateComment(commentUNID);
  commentsArray.push(getOneComment);
}

const getRandomPoster = () => {
  const filmPoster = POSTERS[getRandomInt(0, POSTERS.length - 1)];
  return filmPoster;
};

const getCommentsID = () => {
  const commentsID = [];
  for(let i = 0; i < getRandomInt(1, 12); i++) {
    commentsID.push(commentsUNIDArray[getRandomInt(0, commentsUNIDArray.length - 1)]);
  }
  return commentsID;
};

const generateGenres = () => {
  const genres = [];
  for(let i = 0; i < getRandomInt(1, 4); i++) {
    genres.push(GENRE[getRandomInt(0, GENRE.length - 1)]);
  }
  return genres;
};

export const generateFilm = () => ({
  'id': getUNID(),
  'comments': getCommentsID(),
  'film_info': {
    'title': fishText.getRandomRangeWords({min: 1, max: 4}),
    'altertive_title': fishText.getRandomRangeWords({min: 4, max: 6}),
    'total_rating': `${getRandomInt(1, 9)  }.${  getRandomInt(0, 9)}`,
    'poster': getRandomPoster(),
    'age_rating': getRandomInt(0, 18),
    'director': fishText.getNames({count: 1, type: 'full'}),
    'writers': [
      fishText.getNames({count: 1, type: 'full'}),
      fishText.getNames({count: 1, type: 'full'}),
    ],
    'actors': [
      fishText.getNames({count: 1, type: 'full'}),
      fishText.getNames({count: 1, type: 'full'}),
      fishText.getNames({count: 1, type: 'full'}),
    ],
    'release': {
      'date': generateRandomDate(-26000),
      'release_country': fishText.getCountries({}),
    },
    'runtime': getRandomInt(40, 180),
    'genre': generateGenres(),
    'description': fishText.getRandomRangeWords({min: 40, max: 120}),
  },
  'user_details': {
    'watchlist': booleanGenerate(),
    'already_watched': booleanGenerate(),
    'watching_date': generateRandomDate(-5000),
    'favorite': booleanGenerate(),
  },
});

export { commentsArray };
