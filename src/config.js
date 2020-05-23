import {MovieListType, MovieListKey, MOVIE_BUTTON} from "./constants";

/**
 * Конфигурация для списков фильмов
 * @type {{}}
 */
export const MovieListConfig = {
  [MovieListKey.MAIN]: {
    name: MovieListKey.MAIN,
    label: `All movies. Upcoming`,
    type: MovieListType.MAIN,
  },
  [MovieListKey.MOST_COMMENTED]: {
    name: MovieListKey.MOST_COMMENTED,
    label: `Most commented`,
    type: MovieListType.EXTRA,
  },
  [MovieListKey.TOP_RATED]: {
    name: MovieListKey.TOP_RATED,
    label: `Top rated`,
    type: MovieListType.EXTRA,
  },
  [MovieListKey.EMPTY]: {
    name: MovieListKey.EMPTY,
    label: `There are no movies in our database`,
    type: MovieListType.EMPTY,
  },
  [MovieListKey.LOADING]: {
    name: MovieListKey.LOADING,
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
