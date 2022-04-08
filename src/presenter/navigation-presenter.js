import NavigationView from '../view/navigation';
import { render } from '../utils/render';
import { SITE_MAIN, RenderPosition } from '../utils/constants';

export default class NavigationPresenter {
  constructor() {
    this._navigationTemplate = null;

  }

  init() {
    this._navigationTemplate = new NavigationView();
    this._renderNavigation();

    this._navigationTemplate.setNavClickHandler(this._navClickHandler);
  }

  _renderNavigation() {
    render(SITE_MAIN, this._navigationTemplate, RenderPosition.BEFOREEND);
  }

  _navClickHandler(evt) {
    if(evt.target.tagName === 'A') {
      console.log(evt.target);
    }
  }
}
