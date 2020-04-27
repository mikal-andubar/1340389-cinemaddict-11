import AbstractComponent from "./abstract-component";

import {increaseInt} from "../utils/common";

/**
 * Названия фильтров
 * @type {{}}
 */
export const FilterNames = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

const emptyFilters = [
  {name: FilterNames.ALL, label: `All movies`, count: 0},
  {name: FilterNames.WATCHLIST, label: `Watchlist`, count: 0},
  {name: FilterNames.HISTORY, label: `History`, count: 0},
  {name: FilterNames.FAVORITES, label: `Favorites`, count: 0},
];

/**
 * Генератор фильтров
 * @param {[]} movies
 * @return {[]}
 */
export const generateFilters = (movies) => {
  return movies.reduce((acc, movie) => {
    const [all, watchlist, history, favorites] = acc.map((it) => it.count);

    return [
      {
        name: FilterNames.ALL,
        label: `All movies`,
        count: increaseInt(all),
      },
      {
        name: FilterNames.WATCHLIST,
        label: `Watchlist`,
        count: movie.isInWatchlist ? increaseInt(watchlist) : watchlist,
      },
      {
        name: FilterNames.HISTORY,
        label: `History`,
        count: movie.isWatched ? increaseInt(history) : history,
      },
      {
        name: FilterNames.FAVORITES,
        label: `Favorites`,
        count: movie.isFavorite ? increaseInt(favorites) : favorites,
      },
    ];
  }, emptyFilters);
};

/**
 * Создание разметки фильтра
 * @param {{}} filter
 * @param {number} index
 * @return {string}
 */
const createFilterMarkup = ({name, label, count}, index) => (
  `<a href="#${name}" class="main-navigation__item ${index === 0 ? `main-navigation__item--active` : ``}">
      ${label}
      ${name !== FilterNames.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``}
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
   */
  constructor() {
    super();

    this._movies = [];
  }

  /**
   * Устанавливает список фильмов в компоненте фильтра
   * @param {[]} movies
   */
  setMovies(movies) {
    this._movies = movies;
  }

  /**
   * Возвращает шаблон фильтров
   * @return {string}
   */
  getTemplate() {
    const filters = generateFilters(this._movies);
    return createFiltersTemplate(filters);
  }
}

