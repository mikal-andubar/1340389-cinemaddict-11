import {createElement} from "../utils";

/**
 * Создание списка фильмов
 * @param {string} title
 * @param {boolean} isExtra
 * @return {string}
 */
const createMovieListTemplate = (title, isExtra = false) => (
  `<section class="films-list${isExtra ? `--extra` : ``}">
    <h2 class="films-list__title ${isExtra ? `` : `visually-hidden`}">${title}</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

/**
 * Класс для списка фильмов
 */
export default class MovieList {
  /**
   * Конструктор класса
   * @param {string} title
   * @param {boolean} isExtra
   */
  constructor(title, isExtra = false) {
    this._element = null;
    this._title = title;
    this._isExtra = isExtra;
  }

  /**
   * Возвращает шаблон списка фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieListTemplate(this._title, this._isExtra);
  }

  /**
   * Возвращает элемент DOM
   * @return {null}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Очищает элемент DOM
   */
  removeElement() {
    this._element = null;
  }
}
