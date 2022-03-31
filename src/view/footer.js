// import { createElement } from '../utils/render';

import AbstractView from './abstract-view';

const createFooterTemplate = (filmsCount) => `
  <p>${filmsCount} movies inside</p>
  `;

export default class Footer extends AbstractView {
  constructor(filmsCount) {
    super();
    this.filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterTemplate(this.filmsCount);
  }
}
