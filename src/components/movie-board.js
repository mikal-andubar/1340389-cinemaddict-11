import {createElement} from "../utils";

/**
 * Создание общего контейнера для всех списков фильмов
 * @return {string}
 */
const createMovieBoardTemplate = () => `<section class="films"></section>`;

/**
 * Класс для общего контейнера всех списков фильмов
 */
export default class MovieBoard {
  /**
   * Конструктор класса
   */
  constructor() {
    this._element = null;
  }

  /**
   * Возвращает шаблон общего контейнера для всех списков фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieBoardTemplate();
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
