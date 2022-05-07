import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_MAIN, SITE_FOOTER_STATISTICS, UPDATE_TYPE, AUTORIZATION, END_POINT } from './utils/constants';

import ProfileView from './view/profile';
import FilmsView from './view/films';
import FooterView from './view/footer';
//presenters
import FilmsBoardPresenter from './presenter/films-board';
import NavigationPresenter from './presenter/navigation-presenter';
import PopupPresenter from './presenter/popup-presenter';
// models
import NavigationModel from './model/navigation-model';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';

import ApiFilms from './api-films';

const apiFilms = new ApiFilms(END_POINT, AUTORIZATION);

const navigationModel = new NavigationModel();
const filmsModel = new FilmsModel(apiFilms);
const commentsModel = new CommentsModel();

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);
const siteFilmsView = new FilmsView();
render(SITE_MAIN, siteFilmsView, RenderPosition.BEFOREEND);

const navigationPresenter = new NavigationPresenter(filmsModel, navigationModel);
const filmsBoardPresenter = new FilmsBoardPresenter(filmsModel, navigationModel, commentsModel, siteFilmsView);
new PopupPresenter(filmsModel, commentsModel, siteFilmsView);

navigationPresenter.init();
filmsBoardPresenter.init();

apiFilms.getFilms().then((films) => {
  filmsModel.setFilms(UPDATE_TYPE.INIT, films);
});
// .catch((err) => {
//   console.log(err)
//   filmsModel.setFilms(UPDATE_TYPE.INIT, []);
// });

render(SITE_FOOTER_STATISTICS, new FooterView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
