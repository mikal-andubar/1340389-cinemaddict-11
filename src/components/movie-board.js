import AbstractComponent from "./abstract-component";

/**
 * Создание общего контейнера для всех списков фильмов
 * @return {string}
 */
const createMovieBoardTemplate = () => `<section class="films"></section>`;

/**
 * Класс для общего контейнера всех списков фильмов
 */
export default class MovieBoard extends AbstractComponent {
  /**
   * Возвращает шаблон общего контейнера для всех списков фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieBoardTemplate();
  }
}
