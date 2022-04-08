import { render } from './utils/render';
import { RenderPosition, SITE_HEADER, SITE_MAIN, SITE_FOOTER_STATISTICS } from './utils/constants';
import { FILMS_COUNT } from './utils/constants';

import ProfileView from './view/profile';
import NavigationView from './view/navigation';
import FooterView from './view/footer';
import { generateFilm, commentsArray } from './mock/mock';
import FilmsBoardPresenter from './presenter/films-board';

const defaultFilmsArray = Array.from({length: FILMS_COUNT}, generateFilm);

const filmsCount = +defaultFilmsArray.length;

render(SITE_HEADER, new ProfileView(), RenderPosition.BEFOREEND);
render(SITE_MAIN, new NavigationView(), RenderPosition.BEFOREEND);
render(SITE_FOOTER_STATISTICS, new FooterView(filmsCount), RenderPosition.BEFOREEND);

const filmsBoardPresenter = new FilmsBoardPresenter();
filmsBoardPresenter.init(defaultFilmsArray, commentsArray);

