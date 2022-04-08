import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
//presenters
import FilmsBoardPresenter from './presenter/films-board';
import NavigationPresenter from './presenter/navigation-presenter';

const defaultFilmsArray = Array.from({length: FILMS_COUNT}, generateFilm);

const filmsCount = +defaultFilmsArray.length;

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);
render(SITE_FOOTER_STATISTICS, new FooterView(filmsCount), RenderPosition.BEFOREEND);

const navigationPresenter = new NavigationPresenter();
navigationPresenter.init();

const filmsBoardPresenter = new FilmsBoardPresenter();
filmsBoardPresenter.init(defaultFilmsArray, commentsArray);
