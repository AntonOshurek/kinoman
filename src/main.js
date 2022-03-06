import { createFooterTemplate } from './view/footer';
import { createProfileTemplate } from './view/profile';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';

import { createFilmsTemplate } from './view/films';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

render(siteFooterStatistics, createFooterTemplate(), 'beforeend');
render(siteHeader, createProfileTemplate(), 'beforeend');
render(siteMain, createNavigationTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');
