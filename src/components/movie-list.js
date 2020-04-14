import {clipText} from "../utils";
import {MOVIE_COUNT} from "../constatnts";

/**
 * Отрисовка карточки фильма
 * @param {{}} movie
 * @return {string}
 */
const createMovieCardMarkup = (movie) => {
  const {title, rating, releaseDate, duration, genres, poster, description, comments, isInWatchList, isWatched, isFavorite} = movie;

  const durationString = Math.floor(duration / 60) + `h ` + duration % 60 + `m`;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${durationString}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${clipText(description, 140)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${isInWatchList ? ` film-card__controls-item--active` : ``}">
          Add to watchlist
        </button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${isWatched ? ` film-card__controls-item--active` : ``}">
          Mark as watched
        </button>
        <button class="film-card__controls-item button film-card__controls-item--favorite${isFavorite ? ` film-card__controls-item--active` : ``}">
          Mark as favorite
        </button>
      </form>
    </article>`
  );
};

/**
 * Создаем непосредственно список фильмов
 * @param {[]} movies
 * @return {string}
 */
export const createMovieList = (movies) => movies.map(createMovieCardMarkup).join(`\n`);

/**
 * Создание списка фильмов
 * @param {string} title
 * @param {boolean} isExtra
 * @return {string}
 */
export const createMovieListTemplate = (title, isExtra = false) => (
  `<section class="films-list${isExtra ? `--extra` : ``}">
    <h2 class="films-list__title ${isExtra ? `` : `visually-hidden`}">${title}</h2>
    <div class="films-list__container">
    </div>

    ${isExtra ? `` : `<button class="films-list__show-more">Show more</button>`}
  </section>`
);

/**
 * Создание общего контейнера для всех списков фильмов
 * @return {string}
 */
export const createMovieListContainer = () => `<section class="films"></section>`;

/**
 * Поиск фильмов с наивысшими оценками
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
export const getTopRatedMovies = (movies, count = MOVIE_COUNT.EXTRA) => movies.slice().sort((a, b) => a.rating > b.rating ? -1 : 1).slice(0, count);

/**
 * Поиск фильмов с самым большим количеством комментариев
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
export const getMostCommentedMovies = (movies, count = MOVIE_COUNT.EXTRA) => movies.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1).slice(0, count);
