export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  showObservers() {
    return this._observers;
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
