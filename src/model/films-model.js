import AbstractObserver from '../utils/abstract-observer';

export default class FilmsModel extends AbstractObserver {
  constructor(apiFilms) {
    super();
    this._films = [];
    this._apiFilms = apiFilms;
  }

  setFilms(updateType, films) {
    this._films = films;

    this._notify(updateType);
  }

  updateFilm(updateType, update) {
    this._apiFilms.updateFilm(update).then(() => {
      const index = this._films.findIndex((item) => item.id === update.id);

      if (index === -1) {
        throw new Error('Can\'t update unexisting film');
      }

      this._films = [
        ...this._films.slice(0, index),
        update,
        ...this._films.slice(index + 1),
      ];

      this._notify(updateType, update);
    });
    // .catch((err) => {
    //   console.log(err);
    // });
  }

  getFilms() {
    return this._films;
  }
}
