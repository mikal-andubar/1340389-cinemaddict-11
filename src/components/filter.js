import AbstractSmartComponent from "./abstract-smart-component";
import {increaseInt} from "../utils/common";
import {FilterConfig} from "../constants";

/**
 * Пустой фильтр
 * @type {({name: string, count: number, label: string}|{name: string, count: number, label: string}|{name: string, count: number, label: string}|{name: string, count: number, label: string})[]}
 */
const emptyFilters = [
  {name: FilterConfig.ALL.name, label: FilterConfig.ALL.label, count: 0},
  {name: FilterConfig.WATCHLIST.name, label: FilterConfig.WATCHLIST.label, count: 0},
  {name: FilterConfig.HISTORY.name, label: FilterConfig.HISTORY.label, count: 0},
  {name: FilterConfig.FAVORITES.name, label: FilterConfig.FAVORITES.label, count: 0},
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
        name: FilterConfig.ALL.name,
        label: FilterConfig.ALL.label,
        count: increaseInt(all),
      },
      {
        name: FilterConfig.WATCHLIST.name,
        label: FilterConfig.WATCHLIST.label,
        count: movie.isInWatchlist ? increaseInt(watchlist) : watchlist,
      },
      {
        name: FilterConfig.HISTORY.name,
        label: FilterConfig.HISTORY.label,
        count: movie.isWatched ? increaseInt(history) : history,
      },
      {
        name: FilterConfig.FAVORITES.name,
        label: FilterConfig.FAVORITES.label,
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
      ${name !== FilterConfig.ALL.name ? `<span class="main-navigation__item-count">${count}</span>` : ``}
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
export default class Filter extends AbstractSmartComponent {
  /**
   * Конструктор класса
   */
  constructor() {
    super();

    this._movies = [];
    this._filterChangeHandler = null;
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

  /**
   * Устанавливает обработчик смены фильтра
   * @param {function} handler
   */
  setFilterChangeHandler(handler) {
    this.getElement()
      .querySelectorAll(`.main-navigation__item`)
      .forEach(
          (item) => item.addEventListener(`click`, (event) => {
            event.preventDefault();
            const filterName = event.currentTarget.getAttribute(`href`).slice(1);
            const selectedFilter = Object.values(FilterConfig).find((filter) => filter.name === filterName);
            handler(selectedFilter);
          })
      );
    this._filterChangeHandler = handler;
  }

  /**
   * @inheritDoc
   */
  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }
}

