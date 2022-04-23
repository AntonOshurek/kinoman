import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
const films = Array.from({length: FILMS_COUNT}, generateFilm);
//presenters
import FilmsBoardPresenter from './presenter/films-board';
// models
import Films from './model/films-model';

const filmsModel = new Films();
filmsModel.setFilms(films);
filmsModel.setComments(commentsArray);

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);

const filmsBoardPresenter = new FilmsBoardPresenter();
filmsBoardPresenter.init(films, commentsArray);

render(SITE_FOOTER_STATISTICS, new FooterView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
