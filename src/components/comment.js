import {encode} from "he";

import AbstractComponent from "./abstract-component";

import {formatDate} from "../utils/common";

import {DATE_FORMAT} from "../constants";

/**
 * Класс для работы с комментариями
 */
export default class Comment extends AbstractComponent {

  /**
   * Конструктор класса, принимает объект комментария
   * @param {{}} comment
   */
  constructor(comment) {
    super();

    this._comment = comment;
  }

  /**
   * Возвращает шаблон списка комментариев
   * @return {string}
   */
  getTemplate() {
    return this._createCommentTemplate(this._comment);
  }

  /**
   * Создает шаблон со списком комменатриев
   * @param {{}} comment
   * @return {string}
   */
  _createCommentTemplate({id, emoji, text: notEncodedText, author, date}) {
    const [smile, image] = emoji;
    const displayDate = formatDate(date, DATE_FORMAT.COMMENT);
    const text = encode(notEncodedText);

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${image}" width="55" height="55" alt="emoji-${smile}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${displayDate}</span>
            <button class="film-details__comment-delete" data-target="${id}">Delete</button>
          </p>
        </div>
      </li>`
    );
  }

}
