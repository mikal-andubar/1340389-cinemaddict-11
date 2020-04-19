import AbstractComponent from "./abstract-component";

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
export default class UserProfile extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {{}} user
   */
  constructor(user) {
    super();

    this._user = user;
  }

  /**
   * Возвращает шаблон профиля пользователя
   * @return {string}
   */
  getTemplate() {
    return createUserProfileTemplate(this._user);
  }
}

