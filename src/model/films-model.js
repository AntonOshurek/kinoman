import AbstractObserver from '../utils/abstract-observer';

export default class FilmsModel extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films;

    this._notify(updateType);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    // console.log(updateType);

    this._notify(updateType, update);
  }

  getFilms() {
    return this._films;
  }
}
