// Simple in-memory mock for tests
let store = {};

export default {
  setItem: async (key, value) => {
    store[key] = String(value);
  },
  getItem: async key => {
    return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
  },
  removeItem: async key => {
    delete store[key];
  },
  clear: async () => {
    store = {};
  },
};
