import AbstractComponent from "./abstract-component";

/**
 * Отрисовка статистики
 * @param {number} movieCount
 * @return {string}
 */
const createStatisticsTemplate = (movieCount) => `<p>${movieCount} movies inside</p>`;

/**
 * Класс для статистики
 */
export default class Statistics extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {number} movieCount
   */
  constructor(movieCount) {
    super();

    this._movieCount = movieCount;
  }

  /**
   * Возвращает шаблон статистики
   * @return {string}
   */
  getTemplate() {
    return createStatisticsTemplate(this._movieCount);
  }
}
