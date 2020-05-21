import AbstractSmartComponent from "./abstract-smart-component";
import Comment from "../models/comment";

import {formatDate, formatDuration} from "../utils/common";

import {DATE_FORMAT, EmojiNames, Emojis, MOVIE_BUTTON} from "../constants";
import {MovieCardButton} from "../config";

const emptyComment = {
  emotion: ``,
  comment: ``,
  date: null,
};

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
const getPersonsList = (persons) => persons.map((person) => `${person}`).join(`, `).trim();

/**
 * Создание разметки эмоджи
 * @param {{}} emoji
 * @param {boolean} isActive
 * @return {string}
 */
const createEmojiMarkup = ([emotion, image], isActive = false) => (
  `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${isActive ? `checked` : ``}
  />
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="${image}" width="30" height="30" alt="emoji">
  </label>`
);

/**
 * Создает список эмоджи
 * @param {[]} currentEmoji
 * @return {string}
 */
const createEmojiListTemplate = (currentEmoji) => {
  const emojisMarkup = Object.entries(Emojis).map((emoji) => {
    const isActive = currentEmoji && emoji[0] === currentEmoji[0];
    return createEmojiMarkup(emoji, isActive);
  }).join(`\n`);
  return `<div class="film-details__emoji-list">${emojisMarkup}</div>`;
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

    this.emptyNewComment();

    this._closeBtnHandler = null;
    this._emojiClickHandler = null;
    this._textEntryHandler = null;
    this._formSubmitHandler = null;
    this._moviePopupBtnsHandler = null;
  }

  /**
   * Делает пустым текущий комментарий
   */
  emptyNewComment() {
    this._newComment = Comment.parseComment(emptyComment);
  }

  /**
   * Возвращает шаблон попапа
   * @return {string}
   */
  getTemplate() {
    return this._createMoviePopupTemplate(this._movie);
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
   * Устанавливает текущую эмоцию для комментария
   * @param {string} emojiName
   */
  setCurrentEmoji(emojiName) {
    this._newComment.emoji = [emojiName, Emojis[emojiName]];
  }

  /**
   * Возвращает текущую эмоцию
   * @return {string}
   */
  getCurrentEmoji() {
    return this._newComment.emoji;
  }

  /**
   * Устанавливает текущий текст нового комментария
   * @param {string} text
   */
  setNewCommentText(text) {
    this._newComment.text = text;
  }

  /**
   * Возвращает текущий новый комментарий
   * @return {{}}
   */
  getNewComment() {
    return this._newComment;
  }

  /**
   * Устанавливает обработчик для клика по эмодзи
   * @param {function} handler
   */
  setEmojiClickHandler(handler) {
    Object.values(EmojiNames).forEach((emotion) => {
      this.getElement().querySelector(`#emoji-${emotion}`)
        .addEventListener(`click`, handler);
    });

    this._emojiClickHandler = handler;
  }

  /**
   * Устанавливает обработчик события ввода текста комментария
   * @param {function} handler
   */
  setTextEntryHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, handler);

    this._textEntryHandler = handler;
  }

  /**
   * Устанавливает обработчик отправки формы
   * @param {function} handler
   */
  setFormSubmitHandler(handler) {
    this.getElement().querySelector(`form.film-details__inner`).addEventListener(`keydown`, handler);
    this._formSubmitHandler = handler;
  }

  /**
   * Устанавливает обработчик для кнопок попапа
   * @param {function} handler
   */
  setPopupBtnsHandler(handler) {
    Object.values(MOVIE_BUTTON).forEach((btnName) => {
      this.getElement().querySelector(`input[name=${btnName}]`)
        .addEventListener(`change`, handler);
    });

    this._moviePopupBtnsHandler = handler;
  }

  /**
   * Возвращает текущую позицию элемента попапа
   * @return {number|string}
   */
  getCurrentPos() {
    return this.getElement().scrollTop;
  }

  /**
   * Устанавливает позицию элемента
   * @param {number} position
   */
  setCurrentPos(position) {
    this.getElement().scrollTop = position;
  }

  /**
   * Блокирует форму ввода нового комментария
   */
  disableNewCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  /**
   * Разблокирует форму ввода нового комментария
   */
  enableNewCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  /**
   * Добавляет красную обводку поля ввода при ошибке
   */
  markNewCommentFormError() {
    this.getElement().querySelector(`.film-details__comment-input`).classList.add(`textarea-error`);
  }

  /**
   * Убирает пометку об ошибке с прошлой отправки
   */
  refreshNewCommentForm() {
    this.getElement().querySelector(`.film-details__comment-input`).classList.remove(`textarea-error`);
  }

  /**
   * Подписывает эмелементы попапа на соответствующие события
   * @private
   */
  _subscribeOnEvents() {
    // Подпишем основные кнопки на события
    this.setPopupBtnsHandler(this._moviePopupBtnsHandler);

    // Подпишем кнопку закрытия попапа на события клика
    this.setOnPopupCloseClickHandler(this._closeBtnHandler);

    // Подпишем радио-кнопки с эмодзи для комментариев на события клика
    this.setEmojiClickHandler(this._emojiClickHandler);

    // Отследим ввод комментария
    this.setTextEntryHandler(this._textEntryHandler);

    // Подпишем форму на отправку
    this.setFormSubmitHandler(this._formSubmitHandler);
  }

  /**
   * Создание шаблона с разметкой для попапа
   * @param {{}} movie
   * @return {string}
   */
  _createMoviePopupTemplate(movie) {
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

    const commentsCount = movie.comments.length;

    const currentEmojiMarkup = this._newComment.emoji ?
      `<img src="${this._newComment.emoji[1]}" width="55" height="55" alt="emoji-smile">` : ``;

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
                    <td class="film-details__cell">${director}</td>
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
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

              <ul class="film-details__comments-list">

              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">
                  ${currentEmojiMarkup}
                </div>

                <label class="film-details__comment-label">
                  <textarea
                   class="film-details__comment-input"
                   placeholder="Select reaction below and write comment here"
                   name="comment"
                  >${this._newComment.text}</textarea>
                </label>

                ${createEmojiListTemplate(this._newComment.emoji)}

              </div>
            </section>
          </div>
        </form>
      </section>`
    );
  }

}
