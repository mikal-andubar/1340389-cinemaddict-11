import AbstractComponent from "./abstract-component";

import {clipText, formatDuration} from "../utils/common";

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
export default class MovieCard extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {{}} movie
   */
  constructor(movie) {
    super();

    this._movie = movie;
  }

  /**
   * Возвращает шаблон карточки фильма
   * @return {string}
   */
  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  /**
   * Добавление обработчика события клика к заголовку, постеру и строке с информацией о комментариях
   * @param {function} handler
   */
  setOnPopupOpenClickHandler(handler) {
    const openElements = this.getElement().querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`);
    openElements.forEach(
        (openElement) => openElement.addEventListener(`click`, handler)
    );
  }
}
