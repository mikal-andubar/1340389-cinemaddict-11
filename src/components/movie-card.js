import AbstractComponent from "./abstract-component";

import {clipText, formatDate, formatDuration} from "../utils/common";

import {MOVIE_BUTTON, MovieCardButton} from "../constants";

/**
 * Отрисовывает кнопку для работы с фильмом
 * @param {string} type
 * @param {boolean} isActive
 * @return {string}
 */
const createButtonMarkup = (type, isActive) => (
  `<button
    class="film-card__controls-item button film-card__controls-item--${MovieCardButton[type].name} ${isActive ? `film-card__controls-item--active` : ``}"
    data-type="${type}"
  >
    ${MovieCardButton[type].value}
  </button>`
);

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
    isInWatchlist,
    isWatched,
    isFavorite
  } = movie;

  const displayDate = formatDate(releaseDate);
  const displayDuration = formatDuration(duration);

  const watchlistBtn = createButtonMarkup(MOVIE_BUTTON.WATCHLIST, isInWatchlist);
  const watchedBtn = createButtonMarkup(MOVIE_BUTTON.WATCHED, isWatched);
  const favoriteBtn = createButtonMarkup(MOVIE_BUTTON.FAVORITE, isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${displayDate}</span>
        <span class="film-card__duration">${displayDuration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${clipText(description, 140)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${watchlistBtn}
        ${watchedBtn}
        ${favoriteBtn}
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

    this.setMovieCardBtnsHandler = this.setMovieCardBtnsHandler.bind(this);
  }

  /**
   * Возвращает шаблон карточки фильма
   * @return {string}
   */
  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  /**
   * Подписывает кнопки на карточке фильма на универсальный обработчик клика
   * @param {function} handler
   */
  setMovieCardBtnsHandler(handler) {
    Object.values(MOVIE_BUTTON).forEach((btnName) => {
      this.getElement()
        .querySelector(`.film-card__controls-item--${MovieCardButton[btnName].name}`)
        .addEventListener(`click`, handler);
    });
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
