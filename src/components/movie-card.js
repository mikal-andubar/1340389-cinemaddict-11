import {clipText, createElement, formatDuration} from "../utils";

/**
 * Отрисовка карточки фильма
 * @param {{}} movie
 * @return {string}
 */
const createMovieCardTemplate = (movie) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    description,
    comments,
    isInWatchList,
    isWatched,
    isFavorite
  } = movie;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${formatDuration(duration)}</span>
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
 * Класс для карточки фильма
 */
export default class MovieCard {
  /**
   * Конструктор класса
   * @param {{}} movie
   */
  constructor(movie) {
    this._movie = movie;
    this._element = null;
  }

  /**
   * Возвращает шаблон карточки фильма
   * @return {string}
   */
  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  /**
   * Возвращает элемент DOM
   * @return {null}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Очищает элемент DOM
   */
  removeElement() {
    this._element = null;
  }
}
