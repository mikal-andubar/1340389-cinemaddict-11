import {createElement} from "../utils";
import {MOVIE_LIST_TYPE} from "../constatnts";

/**
 * Создание списка фильмов
 * @param {string} title
 * @param {string} listType
 * @return {string}
 */
const createMovieListTemplate = (title, listType = MOVIE_LIST_TYPE.MAIN) => {
  return (
    `<section class="films-list${listType === MOVIE_LIST_TYPE.EXTRA ? `--${listType}` : ``}">
      <h2 class="films-list__title ${listType === MOVIE_LIST_TYPE.MAIN ? `visually-hidden` : ``}">${title}</h2>
      ${listType === MOVIE_LIST_TYPE.EMPTY ? `` : `<div class="films-list__container"></div>`}
    </section>`
  );
};

/**
 * Класс для списка фильмов
 */
export default class MovieList {
  /**
   * Конструктор класса
   * @param {string} title
   * @param {string} listType
   */
  constructor(title, listType = MOVIE_LIST_TYPE.MAIN) {
    this._element = null;
    this._title = title;
    this._listType = listType;
  }

  /**
   * Возвращает шаблон списка фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieListTemplate(this._title, this._listType);
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
