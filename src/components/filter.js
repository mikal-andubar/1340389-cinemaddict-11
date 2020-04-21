import AbstractComponent from "./abstract-component";

import {FILTER_NAMES} from "../constatnts";

/**
 * Создание разметки фильтра
 * @param {{}} filter
 * @param {number} index
 * @return {string}
 */
const createFilterMarkup = ({name, label, count}, index) => (
  `<a href="#${name}" class="main-navigation__item ${index === 0 ? `main-navigation__item--active` : ``}">
      ${label}
      ${name !== FILTER_NAMES.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``}
  </a>`
);

/**
 * Отрисовка фильтров сайта
 * @param {[]} filters
 * @return {string}
 */
const createFiltersTemplate = (filters) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filters.map(createFilterMarkup).join(`\n`)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

/**
 * Класс для фильтров
 */
export default class Filter extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {[]} filters
   */
  constructor(filters) {
    super();

    this._filters = filters;
  }

  /**
   * Возвращает шаблон фильтров
   * @return {string}
   */
  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}

