import {createElement} from "../utils";

/**
 * Отрисовка звания пользователя и аватара
 * @param {{}} user
 * @return {string}
 */
const createUserProfileTemplate = ({rating, avatar}) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
  </section>`
);

/**
 * Класс для профиля пользователя
 */
export default class UserProfile {
  /**
   * Конструктор класса
   * @param {{}} user
   */
  constructor(user) {
    this._user = user;
    this._element = null;
  }

  /**
   * Возвращает шаблон профиля пользователя
   * @return {string}
   */
  getTemplate() {
    return createUserProfileTemplate(this._user);
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

