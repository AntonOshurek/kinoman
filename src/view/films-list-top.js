import AbstractView from './abstract-view';

const createFilmsListTopTemplate = () => (
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container films-list__container--top">

      </div>
    </section>
  `
);

export default class FilmsListTop extends AbstractView {
  getTemplate() {
    return createFilmsListTopTemplate();
  }
}
