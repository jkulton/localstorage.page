const CONSTANTS = { STORE:{ NOTE: "note" } };

class Store {
  get(key) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return undefined;
    return JSON.parse(storedValue);
  }

  set(key, val) {
    const serializedVal = JSON.stringify(val);
    localStorage.setItem(key, serializedVal);
  }
}

class Note {
  constructor(textarea, statusIndicator, store, constants = CONSTANTS) {
    this.textarea = textarea;
    this.statusIndicator = statusIndicator;
    this.store = store;
    this.constants = constants;
    this.saveDebounce = null;

    this.changeHandler = (e) => {
      if (this.saveDebounce) {
        clearTimeout(this.saveDebounce);
      }
  
      this.saveDebounce = setTimeout(() => {
        this.save();
        this.saveDebounce = clearTimeout(this.saveDebounce);
        this.displaySaveIndicator();
      }, 750);
    };
  }

  save() {
    const noteContent = this.textarea.value;
    this.store.set(this.constants.STORE.NOTE, noteContent);
  }

  load() {
    const savedNote = this.store.get(this.constants.STORE.NOTE);

    if (savedNote) {
      this.textarea.value = savedNote;
    }
  }

  displaySaveIndicator() {
    if (!this.saveDebounce) {
      this.statusIndicator.innerHTML = 'Saved!';

      setTimeout(() => {
        this.statusIndicator.innerHTML = '';
      }, 1000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('textarea');
  const statusIndicator = document.querySelector('.status');

  const store = new Store();
  const note = new Note(textarea, statusIndicator, store);

  textarea.addEventListener('input', note.changeHandler);

  note.load();
});

