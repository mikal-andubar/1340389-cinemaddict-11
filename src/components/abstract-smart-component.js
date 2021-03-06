import AbstractComponent from "./abstract-component";

/**
 * Абстрактный компонент, который поддерживает двухстороннее связывание данных
 */
export default class AbstractSmartComponent extends AbstractComponent {

  /**
   * Восстановление подписки на обработчики событий
   * Абстрактный метод.
   */
  recoveryListeners() {
    throw new Error(`Метод должен быть переопределен в классе-потомке!`);
  }

  /**
   * Ререндер
   */
  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
