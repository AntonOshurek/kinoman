import { createElement } from '../utils/render';

const createFilmsListTemplate = (filmsArrayIsEmpty) => {
  let filmsTitle = '';

  if(!filmsArrayIsEmpty) {
    filmsTitle = 'There are no movies in our database';
  } else {
    filmsTitle = 'All movies. Upcoming';
  }
  return `
  <section class="films-list films-list--main">
    <h2 class="films-list__title">${filmsTitle}</h2>
    <div class="films-list__container films-list__container--main">

    </div>
  </section>`;
};

export default class FilmsList {
  constructor(filmsArrayIsEmpty) {
    this._element = null;
    this._filmsArrayIsEmpty = filmsArrayIsEmpty;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  get template() {
    return createFilmsListTemplate(this._filmsArrayIsEmpty);
  }

  removeElement() {
    this._element = null;
  }
}
