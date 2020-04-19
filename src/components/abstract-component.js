import {createElement} from "../utils/render";

/**
 * Абстрактный компонент, от которого будут унаследованы остальные
 */
export default class AbstractComponent {
  /**
   * Конструктор абстрактного класса
   */
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Невозможно создать экземпляр абстрактного класса!`);
    }

    this._element = null;
  }

  /**
   * Абстрактный метод для возвращения шаблона
   */
  getTemplate() {
    throw new Error(`Метод должен быть переопределен в классе-потомке!`);
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
