import AbstractComponent from "./abstract-component";

import {formatDate} from "../utils/common";

import {DATE_FORMAT, Emojis} from "../constants";

/**
 * Создает шаблон со списком комменатриев
 * @param {{}} comment
 * @return {string}
 */
const createCommentMarkup = ({emoji, text, author, date}) => {
  const [smile, image] = emoji;
  const displayDate = formatDate(date, DATE_FORMAT.COMMENT);
  const displayAuthor = `${author.firstName} ${author.lastName}`;

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${image}" width="55" height="55" alt="emoji-${smile}">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${displayAuthor}</span>
        <span class="film-details__comment-day">${displayDate}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

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
 * @param {string} currentEmoji
 * @return {string}
 */
const createEmojiListTemplate = (currentEmoji) => {
  const emojisMarkup = Object.entries(Emojis).map((emoji) => {
    const isActive = emoji[0] === currentEmoji;
    return createEmojiMarkup(emoji, isActive);
  }).join(`\n`);
  return `<div class="film-details__emoji-list">${emojisMarkup}</div>`;
};


/**
 * Класс для работы с комментариями
 */
export default class Comment extends AbstractComponent {

  /**
   * Конструктор класса, принимает массив комментариев
   * @param {[]} comments
   */
  constructor(comments) {
    super();

    this._comments = comments;
    this._currentEmoji = null;
  }

  /**
   * Создание шаблона списка комментариев
   * @param {[]} comments
   * @return {string}
   */
  _createCommentsTemplate(comments) {
    const currentEmojiMarkup = this._currentEmoji ?
      `<img src="${Emojis[this._currentEmoji]}" width="55" height="55" alt="emoji-smile">` : ``;

    return (
      `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${comments.map(createCommentMarkup).join(`\n`)}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
          ${currentEmojiMarkup}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        ${createEmojiListTemplate(this._currentEmoji)}

      </div>`
    );
  }

  /**
   * Возвращает шаблон списка комментариев
   * @return {string}
   */
  getTemplate() {
    return this._createCommentsTemplate(this._comments);
  }

  /**
   * Устанавливает текущую эмоцию для комментария
   * @param {string} emojiName
   */
  setCurrentEmoji(emojiName) {
    this._currentEmoji = emojiName;
  }

}
