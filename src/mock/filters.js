import {FILTER_NAMES} from "../constatnts";
import {increaseInt} from "../utils";

const EMPTY_FILTERS = [
  {name: FILTER_NAMES.ALL, label: `All movies`, count: 0},
  {name: FILTER_NAMES.WATCHLIST, label: `Watchlist`, count: 0},
  {name: FILTER_NAMES.HISTORY, label: `History`, count: 0},
  {name: FILTER_NAMES.FAVORITES, label: `Favorites`, count: 0},
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
        name: FILTER_NAMES.ALL,
        label: `All movies`,
        count: increaseInt(all),
      },
      {
        name: FILTER_NAMES.WATCHLIST,
        label: `Watchlist`,
        count: movie.isInWatchList ? increaseInt(watchlist) : watchlist,
      },
      {
        name: FILTER_NAMES.HISTORY,
        label: `History`,
        count: movie.isWatched ? increaseInt(history) : history,
      },
      {
        name: FILTER_NAMES.FAVORITES,
        label: `Favorites`,
        count: movie.isFavorite ? increaseInt(favorites) : favorites,
      },
    ];
  }, EMPTY_FILTERS);
};

