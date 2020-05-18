const getMoviesByProperty = (movies, property) => movies.filter((movie) => movie[property]);

/**
 * Возвращает список фильмов с учетом фильтра
 * @param {[]} movies
 * @param {string} filterName
 * @return {*}
 */
import {FilterConfig} from "../constants";

export const getMoviesByFilter = (movies, filter) => {
  if (filter === FilterConfig.ALL) {
    return movies;
  }
  return getMoviesByProperty(movies, filter.property);
};
