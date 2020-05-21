import {FilterConfig} from "../config";

import {getMoviesByFilter} from "../utils/filter";

/**
 * Модель данных для списка фильмов
 */
export default class Movies {

  /**
   * Конструктор класса
   */
  constructor() {
    this._movies = [];

    this._currentFilter = FilterConfig.ALL;

    this._filterChangeHandlers = [];
  }

  /**
   * Устанавливает массив фильмов
   * @param {{}} movies
   */
  setMovies(movies) {
    this._movies = movies;
  }

  /**
   * Возвращает массив фильмов
   * @return {{}[]}
   */
  getMovies() {
    return getMoviesByFilter(this._movies, this._currentFilter);
  }

  /**
   * Обновляет данные фильма
   * @param {number} movieId
   * @param {Movie} newData
   * @return {boolean}
   */
  updateMovie(movieId, newData) {
    const index = this._movies.findIndex((movie) => movie.id === movieId);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newData, this._movies.slice(index + 1));
    return true;
  }

  /**
   * Возвращает массив всех фильмов в базе
   * @return {{}[]}
   */
  getAllMovies() {
    return this._movies;
  }

  /**
   * Устанавливает текущий фильтр
   * @param {{}} filter
   */
  setCurrentFilter(filter) {
    this._currentFilter = filter;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
   * Добавляет обработчик для смены фильтра
   * @param {function} handler
   */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /**
   * Вызов обработчиков
   * @param {[]} handlers
   * @private
   */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
