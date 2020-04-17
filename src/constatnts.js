/**
 * Место для рендера
 * @type {{}}
 */
export const RENDER_PLACE = {
  BEFORE_END: `beforeend`,
  BEFORE_BEGIN: `beforebegin`,
  AFTER_END: `afterend`,
  AFTER_BEGIN: `afterbegin`,
};

/**
 * Названия месяцев
 * @type {string[]}
 */
export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

/**
 * Константы названий фильтров
 * @type {}
 */
export const FILTER_NAMES = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

/**
 * Константы управляющие отображением
 * @type {{}}
 */
export const MOVIE_COUNT = {
  TOTAL: 20,
  ON_START: 5,
  ON_BTN: 5,
  EXTRA: 2
};

/**
 * Типы списка фильмов: основной, дополнительный, пустой
 * @type {{}}
 */
export const MOVIE_LIST_TYPE = {
  EMPTY: `empty`,
  MAIN: `main`,
  EXTRA: `extra`,
};
