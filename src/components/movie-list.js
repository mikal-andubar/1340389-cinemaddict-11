import AbstractComponent from "./abstract-component";

import {MovieListType} from "../constants";

/**
 * Создание списка фильмов
 * @param {{}} listConfig
 * @return {string}
 */
const createMovieListTemplate = ({label: title, type: listType = MovieListType.MAIN}) => {
  return (
    `<section class="films-list${listType === MovieListType.EXTRA ? `--${listType}` : ``}">
      <h2 class="films-list__title ${listType === MovieListType.MAIN ? `visually-hidden` : ``}">${title}</h2>
      ${listType === MovieListType.EMPTY ? `` : `<div class="films-list__container"></div>`}
    </section>`
  );
};

/**
 * Класс для списка фильмов
 */
export default class MovieList extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {{}} listConfig
   */
  constructor(listConfig) {
    super();

    this._listConfig = listConfig;
  }

  /**
   * Возвращает шаблон списка фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieListTemplate(this._listConfig);
  }

  /**
   * Возвращает элемент, в который непосредственно помещаются карточки фильмов
   * @return {Element}
   */
  getListElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }

  /**
   * Возвращает конфигурацию списка
   * @return {{}}
   */
  getListConfig() {
    return this._listConfig;
  }

  /**
   * Возвращает тип списка
   * @return {string}
   */
  getListType() {
    return this._listConfig.type;
  }

  /**
   * Очищает содержимое списка фильмов
   */
  clearList() {
    const innerList = this.getElement().querySelector(`.films-list__container`);
    innerList.innerHTML = ``;
  }
}
