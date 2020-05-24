import Movie from "../models/movie";
import Comment from "../models/comment";
import {StorageName} from "../constants";

/**
 * Создает объект, который будет записан в хранилище
 * @param {[]} items
 * @return {{}}
 */
const createStoringStructure = (items) => (
  items.reduce((acc, item) => {
    return Object.assign({}, acc, {
      [item.id]: item.toServerStructure()
    });
  }, {})
);

/**
 * Класс провайдера
 */
export default class Provider {
  /**
   * Конструктор класса
   * @param {API} api
   * @param {Store} store
   */
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needToSync = false;
  }

  /**
   * Возвращает текущее состояние необходимости синхронизации
   * @return {boolean}
   */
  isNeedToSync() {
    return this._needToSync;
  }

  /**
   * Получает фильмы с сервера
   * @return {Promise}
   */
  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies()
        .then((movies) => {
          const storingMovies = createStoringStructure(movies);

          this._store.setItems(StorageName.MOVIES, storingMovies);

          return movies;
        });
    }

    const storedMovies = Object.values(this._store.getItems(StorageName.MOVIES));

    return Promise.resolve(Movie.parseMovies(storedMovies));
  }

  /**
   * Обновляет данные на сервере
   * @param {Movie} newData
   * @return {Promise<any>}
   */
  updateMovie(newData) {
    if (this._isOnLine()) {
      return this._api.updateMovie(newData)
        .then((movie) => {
          this._store.setItem(StorageName.MOVIES, movie.id, movie.toServerStructure());

          return movie;
        });
    }

    const localData = Movie.clone(newData);

    this._store.setItem(StorageName.MOVIES, newData.id, localData.toServerStructure());
    this._needToSync = true;

    return Promise.resolve(localData);
  }

  /**
   * Получает все комментарии
   * @param {{}} movies
   * @return {Promise}
   */
  getComments(movies) {
    if (this._isOnLine()) {
      return this._api.getComments(movies)
        .then((comments) => {
          const storingComments = createStoringStructure(comments);

          this._store.setItems(StorageName.COMMENTS, storingComments);

          return comments;
        });
    }

    const storedComments = Object.values(this._store.getItems(StorageName.COMMENTS));

    return Promise.resolve(Comment.parseComments(storedComments));
  }

  /**
   * Добавляет комментарий на сервер
   * @param {number} movieId
   * @param {Comment} newData
   * @return {Promise<any>}
   */
  addComment(movieId, newData) {
    if (this._isOnLine()) {
      return this._api.addComment(movieId, newData);
    }

    return Promise.reject(`Работа с комментариями оффлайн невозможна`);
  }

  /**
   * Удаляет комментарий на сервере
   * @param {number} commentId
   * @return {Promise}
   */
  deleteComment(commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(`Работа с комментариями оффлайн невозможна`);
  }

  /**
   * Синхронизация с свервером
   * @return {Promise}
   */
  sync() {
    if (this._isOnLine()) {
      const storedMovies = Object.values(this._store.getItems(StorageName.MOVIES));

      return this._api.sync(storedMovies)
        .then((response) => {
          const updatedMovies = response.updated;

          const storingMovies = createStoringStructure(updatedMovies);
          this._store.setItems(StorageName.MOVIES, storingMovies);
        });
    }

    return Promise.reject(new Error(`Синхронизация не удалась!`));
  }

  /**
   * Проверка доступности интернета
   * @return {boolean}
   */
  _isOnLine() {
    return window.navigator.onLine;
  }
}
