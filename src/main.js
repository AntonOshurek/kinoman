import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_MAIN, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import FilmsView from './view/films';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
const filmsData = Array.from({length: FILMS_COUNT}, generateFilm);
//presenters
import FilmsBoardPresenter from './presenter/films-board';
import NavigationPresenter from './presenter/navigation-presenter';
import PopupPresenter from './presenter/popup-presenter';
// models
import NavigationModel from './model/navigation-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

const navigationModel = new NavigationModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
filmsModel.setFilms(filmsData);
commentsModel.setComments(commentsArray);

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);
const siteFilmsView = new FilmsView();
render(SITE_MAIN, siteFilmsView, RenderPosition.BEFOREEND);

const navigationPresenter = new NavigationPresenter(filmsModel, navigationModel);
const filmsBoardPresenter = new FilmsBoardPresenter(filmsModel, navigationModel, commentsModel, siteFilmsView);
new PopupPresenter(filmsModel, commentsModel, siteFilmsView);

navigationPresenter.init();
filmsBoardPresenter.init();

render(SITE_FOOTER_STATISTICS, new FooterView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
