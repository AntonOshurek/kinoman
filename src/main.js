import { createFooterTemplate } from './view/footer';
import { reateProfileTemplate } from './view/profile';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteFooterStatistics = document.querySelector('.footer__statistics');
const siteHeader = document.querySelector('.header');

render(siteFooterStatistics, createFooterTemplate(), 'beforeend');
render(siteHeader, reateProfileTemplate(), 'beforeend');

