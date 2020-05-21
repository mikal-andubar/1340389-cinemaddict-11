import AbstractComponent from "./abstract-component";
import {increaseInt} from "../utils/common";

/**
 * Рейтинг пользователя в зависимости от количества просмотренных фильмов
 * @type {{}}
 */
const userRatings = {
  [`Novice`]: 1,
  [`Fan`]: 11,
  [`Movie Buff`]: 21,
};

/**
 * Возвращает строку с рейтингом по переданному количеству
 * @param {number} count
 * @return {string}
 */
const getRating = (count) => {
  let rating = ``;
  for (const key in userRatings) {
    if (count >= userRatings[key]) {
      rating = key;
    } else {
      break;
    }
  }
  return rating;
};

/**
 * Вычисляет рейтинг пользователя
 * @param {[]} movies
 * @return {string|string}
 */
const calculateUserRating = (movies) => {
  const ratingCalc = movies.reduce((ratingAcc, movie) => {
    const count = movie.isWatched ? increaseInt(ratingAcc.count) : ratingAcc.count;

    return {
      rating: getRating(count),
      count,
    };
  }, {rating: ``, count: 0});

  return ratingCalc.rating;
};

/**
 * Генерирует информацию о пользователе
 * @param {{}} movies
 * @return {{rating: string, avatar: string}}
 */
export const generateUser = (movies) => ({
  rating: calculateUserRating(movies),
  avatar: `images/bitmap@2x.png`
});

/**
 * Класс для профиля пользователя
 */
export default class UserProfile extends AbstractComponent {

  /**
   * Конструктор класса
   * @param {Movies} moviesModel
   */
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
    this.refreshUser();
  }

  /**
   * Устанавливает текущего пользователя
   */
  refreshUser() {
    this._user = generateUser(this._moviesModel.getAllMovies());
    this.rerender();
  }

  /**
   * Возвращает данные пользователя
   * @return {{}}
   */
  getUser() {
    return this._user;
  }

  /**
   * Возвращает шаблон профиля пользователя
   * @return {string}
   */
  getTemplate() {
    return this._createUserProfileTemplate();
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
  }

  /**
   * Отрисовка звания пользователя и аватара
   * @return {string}
   */
  _createUserProfileTemplate() {
    const {rating, avatar} = this._user ? this._user : {};
    return (
      `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
    </section>`
    );
  }

}

