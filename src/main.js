import { render } from './services/render';

//views
import { createFooterTemplate } from './view/footer';
import { createProfileTemplate } from './view/profile';
import { createNavigationTemplate } from './view/navigation';
import { createSortTemplate } from './view/sort';
import { createFilmsTemplate } from './view/films';

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');
const siteMain = document.querySelector('.main');

render(siteHeader, createProfileTemplate(), 'beforeend');
render(siteMain, createNavigationTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');
render(siteFooterStatistics, createFooterTemplate(), 'beforeend');
