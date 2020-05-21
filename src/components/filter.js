import AbstractSmartComponent from "./abstract-smart-component";
import {increaseInt} from "../utils/common";
import {FilterConfig} from "../config";

const STATS_BTN_NAME = `stats`;

const FILTER_BTN_CLASS = `main-navigation__item`;
const STATS_BTN_CLASS = `main-navigation__additional`;

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

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
  `<a href="#${name}" class="${FILTER_BTN_CLASS} ${index === 0 ? ACTIVE_FILTER_CLASS : ``}">
      ${label}
      ${name !== FilterConfig.ALL.name ? `<span class="${FILTER_BTN_CLASS}-count">${count}</span>` : ``}
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
    <a href="#${STATS_BTN_NAME}" class="${STATS_BTN_CLASS}">Stats</a>
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
    this._statisticsViewHandler = null;
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
      .querySelectorAll(`.${FILTER_BTN_CLASS}`)
      .forEach(
          (item) => item.addEventListener(`click`, (event) => {
            event.preventDefault();
            const filterName = event.currentTarget.getAttribute(`href`).slice(1);
            const selectedFilter = Object.values(FilterConfig).find((filter) => filter.name === filterName);
            this._activateNavigationBtn(filterName);
            handler(selectedFilter);
          })
      );
    this._filterChangeHandler = handler;
  }

  /**
   * Устанавливает обработчик на переключение на отображение статистики
   * @param {function} handler
   */
  setStatisticsViewHandler(handler) {
    this.getElement()
      .querySelector(`.${STATS_BTN_CLASS}`)
      .addEventListener(`click`, () => {
        this._activateNavigationBtn(`stats`);
        handler();
      });
    this._statisticsViewHandler = handler;
  }

  /**
   * @inheritDoc
   */
  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
    this.setStatisticsViewHandler(this._statisticsViewHandler);
  }

  /**
   * Деактивирует все кнопки навигации
   * @private
   */
  _deactivateNavigationBtns() {
    this.getElement()
      .querySelectorAll(`.${FILTER_BTN_CLASS},.${STATS_BTN_CLASS}`)
      .forEach((btn) => {
        btn.classList.remove(ACTIVE_FILTER_CLASS);
      });
  }

  /**
   * Активирует указанный пункт меню фильтров
   * @param {string} activeBtnName
   * @private
   */
  _activateNavigationBtn(activeBtnName) {
    this._deactivateNavigationBtns();
    this.getElement()
      .querySelectorAll(`.${FILTER_BTN_CLASS},.${STATS_BTN_CLASS}`)
      .forEach((btn) => {
        const btnName = btn.getAttribute(`href`).slice(1);
        if (btnName === activeBtnName) {
          btn.classList.add(ACTIVE_FILTER_CLASS);
        }
      });
  }
}

