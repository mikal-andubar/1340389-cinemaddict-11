import AbstractComponent from "./abstract-component";

/**
 * Отрисовка статистики
 * @param {number} movieCount
 * @return {string}
 */
const createFooterStatisticsTemplate = (movieCount) => `<p>${movieCount} movies inside</p>`;

/**
 * Класс для статистики
 */
export default class FooterStatistics extends AbstractComponent {
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
    return createFooterStatisticsTemplate(this._movieCount);
  }
}
