import {createElement} from "../utils";

/**
 * Типы списка фильмов: основной, дополнительный, пустой
 * @type {{}}
 */
export const MovieListType = {
  EMPTY: `empty`,
  MAIN: `main`,
  EXTRA: `extra`,
};

/**
 * Создание списка фильмов
 * @param {string} title
 * @param {string} listType
 * @return {string}
 */
const createMovieListTemplate = (title, listType = MovieListType.MAIN) => {
  return (
    `<section class="films-list${listType === MovieListType.EXTRA ? `--${listType}` : ``}">
      <h2 class="films-list__title ${listType === MovieListType.MAIN ? `visually-hidden` : ``}">${title}</h2>
      ${listType === MovieListType.EMPTY ? `` : `<div class="films-list__container"></div>`}
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
  constructor(title, listType = MovieListType.MAIN) {
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
