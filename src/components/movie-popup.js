import Comment from "./comment";
import AbstractSmartComponent from "./abstract-smart-component";

import {formatDate, formatDuration} from "../utils/common";

import {DATE_FORMAT, EmojiNames, MOVIE_BUTTON, MovieCardButton} from "../constants";

/**
 * Создание шаблона списка жанров
 * @param {[]} genres
 * @return {string}
 */
const createGenresListMarkup = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

/**
 * Создает разметку элемента управления информацией о фильме
 * @param {string} type
 * @param {boolean} isActive
 * @return {string}
 */
const createPopupButtonMarkup = (type, isActive) => {
  const buttonLabel = MovieCardButton[type].value;
  return (
    `<input
        type="checkbox"
        class="film-details__control-input visually-hidden"
        id="${type}"
        name="${type}"
        data-type="${type}"
        ${isActive ? `checked` : ``}
    >
    <label
        for="${type}"
        class="film-details__control-label film-details__control-label--${type}"
    >
      ${buttonLabel}
    </label>`
  );
};

/**
 * Возвращает строку со списком людей через запятую
 * @param {{}[]} persons
 * @return {string}
 */
const getPersonsList = (persons) => persons.map((person) => `${person.firstName} ${person.lastName}`).join(`, `).trim();

/**
 * Создание шаблона с разметкой для попапа
 * @param {{}} movie
 * @param {string} commentsTemplate
 * @return {string}
 */
const createMoviePopupTemplate = (movie, commentsTemplate) => {
  const {
    title,
    originalTitle,
    director,
    writers,
    actors,
    country,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    description,
    age,
    isInWatchlist,
    isWatched,
    isFavorite
  } = movie;

  const displayDate = formatDate(releaseDate, DATE_FORMAT.POPUP);
  const writersList = getPersonsList(writers);
  const actorsList = getPersonsList(actors);

  const watchlistButton = createPopupButtonMarkup(MOVIE_BUTTON.WATCHLIST, isInWatchlist);
  const watchedButton = createPopupButtonMarkup(MOVIE_BUTTON.WATCHED, isWatched);
  const favoriteButton = createPopupButtonMarkup(MOVIE_BUTTON.FAVORITE, isFavorite);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director.firstName} ${director.lastName}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${displayDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${createGenresListMarkup(genres)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          ${watchlistButton}
          ${watchedButton}
          ${favoriteButton}
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          ${commentsTemplate}
        </section>
      </div>
    </form>
  </section>`
  );
};

/**
 * Класс для попапа с детальной информацией о фильме
 */
export default class MoviePopup extends AbstractSmartComponent {
  /**
   * Конструктор класса
   * @param {{}} movie
   */
  constructor(movie) {
    super();

    this._movie = movie;
    this._commentComponent = new Comment(this._movie.comments);

    this._closeBtnHandler = null;

    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._moviePopupBtnsHandler = this._moviePopupBtnsHandler.bind(this);

    this._subscribeOnEvents();
  }

  /**
   * Возвращает шаблон попапа
   * @return {string}
   */
  getTemplate() {
    const commentsTemplate = this._commentComponent.getTemplate();

    return createMoviePopupTemplate(this._movie, commentsTemplate);
  }

  /**
   * Восстанавливает обработчики событий после ререндера
   */
  recoveryListeners() {
    this._subscribeOnEvents();
  }

  /**
   * Добавление обработчика события клика к кнопке закрытия
   * @param {function} handler
   */
  setOnPopupCloseClickHandler(handler) {
    const closePopupBtn = this.getElement().querySelector(`.film-details__close-btn`);
    closePopupBtn.addEventListener(`click`, handler);
    this._closeBtnHandler = handler;
  }

  /**
   * Подписывает эмелементы попапа на соответствующие события
   * @private
   */
  _subscribeOnEvents() {
    const element = this.getElement();

    // Подпишем все кнопки на события
    Object.values(MOVIE_BUTTON).forEach((btnName) => {
      element.querySelector(`input[name=${btnName}]`)
        .addEventListener(`change`, this._moviePopupBtnsHandler);
    });

    // Подпишем кнопку закрытия попапа на события клика
    this.setOnPopupCloseClickHandler(this._closeBtnHandler);

    // Подпишем радио-кнопки с эмодзи для комментариев на события клика
    Object.values(EmojiNames).forEach((emotion) => {
      element.querySelector(`#emoji-${emotion}`)
        .addEventListener(`click`, this._emojiClickHandler);
    });
  }

  /**
   * Универсальный обработчик событий для элементов попапа
   * @param {Event} event
   */
  _moviePopupBtnsHandler(event) {
    event.preventDefault();

    const buttonType = event.currentTarget.dataset.type;
    const property = MovieCardButton[buttonType].property;

    this._movie[property] = !this._movie[property];

    this.rerender();
  }

  /**
   * Обработчик кликов по смайликам
   * @param {Event} event
   */
  _emojiClickHandler(event) {
    const emojiName = event.currentTarget.value;

    this._commentComponent.setCurrentEmoji(emojiName);

    this.rerender();
  }
}

