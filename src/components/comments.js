import {formatTime} from "../utils";

/**
 * Массив объектов комментариев
 * @type {({image: string, emotion: string}|{image: string, emotion: string}|{image: string, emotion: string}|{image: string, emotion: string})[]}
 */
export const emojiSet = [
  {
    emotion: `smile`,
    image: `./images/emoji/smile.png`
  },
  {
    emotion: `angry`,
    image: `./images/emoji/angry.png`
  },
  {
    emotion: `sleeping`,
    image: `./images/emoji/sleeping.png`
  },
  {
    emotion: `puke`,
    image: `./images/emoji/puke.png`
  },
];

/**
 * Создает шаблон со списком комменатриев
 * @param {{}} comment
 * @return {string}
 */
const createCommentMarkup = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="${comment.emoji.image}" width="55" height="55" alt="emoji-${comment.emoji.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${formatTime(comment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
);

/**
 * Создание разметки эмоджи
 * @param {{}} emoji
 * @return {string}
 */
const createEmojiMarkup = (emoji) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.emotion}" value="${emoji.emotion}" />
    <label class="film-details__emoji-label" for="emoji-${emoji.emotion}">
      <img src="${emoji.image}" width="30" height="30" alt="emoji">
    </label>`
);

/**
 * Создает список эмоджи
 * @param {[]} emojiList
 * @return {string}
 */
export const createEmojiListTemplate = (emojiList) => `<div class="film-details__emoji-list">${emojiList.map(createEmojiMarkup).join(`\n`)}</div>`;


/**
 * Создание шаблона списка комментариев
 * @param {[]} comments
 * @return {string}
 */
export const createCommentsTemplate = (comments) => (
  `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
    ${comments.map(createCommentMarkup).join(`\n`)}
  </ul>

  <div class="film-details__new-comment">
    <div for="add-emoji" class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    ${createEmojiListTemplate(emojiSet)}

  </div>`
);
