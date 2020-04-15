import {createElement} from "../utils";

/**
 * Отрисовка статистики
 * @param {number} movieCount
 * @return {string}
 */
const createStatisticsTemplate = (movieCount) => `<p>${movieCount} movies inside</p>`;

/**
 * Класс для статистики
 */
export default class Stat {
  /**
   * Конструктор класса
   * @param {number} movieCount
   */
  constructor(movieCount) {
    this._movieCount = movieCount;
    this._element = null;
  }

  /**
   * Возвращает шаблон статистики
   * @return {string}
   */
  getTemplate() {
    return createStatisticsTemplate(this._movieCount);
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
