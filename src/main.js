import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
//presenters
import FilmsBoardPresenter from './presenter/films-board';
import NavigationPresenter from './presenter/navigation-presenter';
// models
import NavigationModel from './model/navigation-model';
import FilmsModel from './model/films-model';

const navigationModel = new NavigationModel();
const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);
filmsModel.setComments(commentsArray);

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);

const navigationPresenter = new NavigationPresenter(filmsModel, navigationModel);
const filmsBoardPresenter = new FilmsBoardPresenter(filmsModel, navigationModel);

navigationPresenter.init();
filmsBoardPresenter.init();

render(SITE_FOOTER_STATISTICS, new FooterView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
