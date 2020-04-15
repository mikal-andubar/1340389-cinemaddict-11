import {createElement} from "../utils";

const createShowMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

/**
 * Класс для кнопки "Show More"
 */
export default class ShowMoreButton {
  /**
   * Конструктор класса
   */
  constructor() {
    this._element = null;
  }

  /**
   * Возвращает шаблон кнопки "Show More"
   * @return {string}
   */
  getTemplate() {
    return createShowMoreButtonTemplate();
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
