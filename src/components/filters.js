import {FILTER_NAMES} from "../constatnts";

/**
 * Создание разметки фильтра
 * @param {{}} filter
 * @return {string}
 */
const createFilterMarkup = (filter) => {
  const {name, label, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item">
        ${label}
        ${name !== FILTER_NAMES.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

/**
 * Отрисовка фильтров сайта
 * @param {[]} filters
 * @return {string}
 */
export const createFiltersTemplate = (filters) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filters.map(createFilterMarkup).join(`\n`)}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);
