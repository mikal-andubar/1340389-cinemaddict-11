import {createElement} from "../utils/render";

const HIDDEN_CLASS = `visually-hidden`;

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
   * @return {string}
   */
  getTemplate() {
    if (this instanceof AbstractComponent) {
      throw new Error(`Метод должен быть переопределен в классе-потомке!`);
    }

    return ``;
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

  /**
   * Показывает компонент
   */
  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  /**
   * Скрывает компонент
   */
  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }
}
