import {FILTER_NAMES} from "../constatnts";
import {createElement} from "../utils";

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
export default class Filter {
  /**
   * Конструктор класса
   * @param {[]} filters
   */
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  /**
   * Возвращает шаблон фильтров
   * @return {string}
   */
  getTemplate() {
    return createFiltersTemplate(this._filters);
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

