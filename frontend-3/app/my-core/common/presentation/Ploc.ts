export abstract class Ploc<S> {
  private listeners: Array<(state: S) => void> = [];

  constructor(private _state: S) {}

  get state(): S {
    return this._state;
  }

  changeState(state: S) {
    this._state = state;
    this.listeners.forEach((listener) => listener(this._state));
  }

  addListener(listener: (state: S) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (state: S) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  dispose() {
    this.listeners = [];
  }
}
