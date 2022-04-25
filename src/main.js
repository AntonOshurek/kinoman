import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
//presenters
import FilmsBoardPresenter from './presenter/films-board';
// models
import FilmsModel from './model/films-model';

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);
filmsModel.setComments(commentsArray);

const dataLength = filmsModel.getFilms().length;

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);

const filmsBoardPresenter = new FilmsBoardPresenter(filmsModel);
filmsBoardPresenter.init();

render(SITE_FOOTER_STATISTICS, new FooterView(dataLength), RenderPosition.BEFOREEND);
