import {StorageName} from "../constants";

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;

/**
 * Локальное хранилище
 */
export default class Store {
  constructor() {
    this._storage = window.localStorage;

    this._storageKey = {
      [StorageName.MOVIES]: `${STORE_PREFIX}-${StorageName.MOVIES}-${STORE_VER}`,
      [StorageName.COMMENTS]: `${STORE_PREFIX}-${StorageName.COMMENTS}-${STORE_VER}`,
    };
  }

  /**
   * Получает данные из хранилища
   * @param {string} storageName
   * @return {any|{}}
   */
  getItems(storageName) {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey[storageName])) || {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Записывает объект в хранилище
   * @param {string} storageName
   * @param {string} key
   * @param {*} value
   */
  setItem(storageName, key, value) {
    const store = this.getItems(storageName);

    this._storage.setItem(
        this._storageKey[storageName],
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  /**
   * Записывает список объектов в хранилище
   * @param {string} storageName
   * @param {{}} items
   */
  setItems(storageName, items) {
    this._storage.setItem(
        this._storageKey[storageName],
        JSON.stringify(items)
    );
  }
}
