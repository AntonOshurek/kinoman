import AbstractView from './abstract-view';

const createFilmsListCommentedTemplate = () => (
  `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container films-list__container--commented">

      </div>
    </section>
  `
);

export default class FilmsListCommented extends AbstractView {
  getTemplate() {
    return createFilmsListCommentedTemplate();
  }
}
