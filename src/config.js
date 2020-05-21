import {MovieListType, MOVIE_LIST_KEY, MOVIE_BUTTON} from "./constants";

/**
 * Конфигурация для списков фильмов
 * @type {{}}
 */
export const MovieListConfig = {
  [MOVIE_LIST_KEY.MAIN]: {
    name: MOVIE_LIST_KEY.MAIN,
    label: `All movies. Upcoming`,
    type: MovieListType.MAIN,
  },
  [MOVIE_LIST_KEY.MOST_COMMENTED]: {
    name: MOVIE_LIST_KEY.MOST_COMMENTED,
    label: `Most commented`,
    type: MovieListType.EXTRA,
  },
  [MOVIE_LIST_KEY.TOP_RATED]: {
    name: MOVIE_LIST_KEY.TOP_RATED,
    label: `Top rated`,
    type: MovieListType.EXTRA,
  },
  [MOVIE_LIST_KEY.EMPTY]: {
    name: MOVIE_LIST_KEY.EMPTY,
    label: `There are no movies in our database`,
    type: MovieListType.EMPTY,
  },
  [MOVIE_LIST_KEY.LOADING]: {
    name: MOVIE_LIST_KEY.LOADING,
    label: `Loading...`,
    type: MovieListType.EMPTY,
  },
};

/**
 * Конфигурация фильтров
 * @type {{}}
 */
export const FilterConfig = {
  ALL: {
    name: `all`,
    label: `All movies`,
    property: null,
  },
  WATCHLIST: {
    name: `watchlist`,
    label: `Watchlist`,
    property: `isInWatchlist`,
  },
  HISTORY: {
    name: `history`,
    label: `History`,
    property: `isWatched`,
  },
  FAVORITES: {
    name: `favorites`,
    label: `Favorites`,
    property: `isFavorite`,
  },
};

/**
 * Конфигурация для кнопок на карточке фильма
 * @type {{}}
 */
export const MovieCardButton = {
  [MOVIE_BUTTON.WATCHLIST]: {
    name: `add-to-watchlist`,
    value: `Add to watchlist`,
    property: `isInWatchlist`,
  },
  [MOVIE_BUTTON.WATCHED]: {
    name: `mark-as-watched`,
    value: `Mark as watched`,
    property: `isWatched`,
  },
  [MOVIE_BUTTON.FAVORITE]: {
    name: `favorite`,
    value: `Mark as favorite`,
    property: `isFavorite`,
  },
};
