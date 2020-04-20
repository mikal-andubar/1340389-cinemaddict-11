import AbstractComponent from "./abstract-component";

/**
 * Создает шаблон разметки для кнопки "Show More"
 * @return {string}
 */
const createShowMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

/**
 * Класс для кнопки "Show More"
 */
export default class ShowMoreButton extends AbstractComponent {
  /**
   * Возвращает шаблон кнопки "Show More"
   * @return {string}
   */
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  /**
   * Добавляет обработчик события клика по кнопке
   * @param {function} handler
   */
  setOnClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
