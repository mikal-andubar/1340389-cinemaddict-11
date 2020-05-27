import {deleteFromArray, findObjectIndexInArrayById} from "../utils/common";

/**
 * Модель данных для комментариев
 */
export default class Comments {

  /**
   * Конструктор класса
   */
  constructor() {
    this._comments = [];

    this.addComment = this.addComment.bind(this);
  }

  /**
   * Устанавливает массив комментариев
   * @param {Comment[]} comments
   */
  setComments(comments) {
    this._comments = [];
    this.addComments(comments);
  }

  /**
   * Добавляет комментарии к модели
   * @param {Comment[]} comments
   */
  addComments(comments) {
    comments.forEach(this.addComment);
  }

  /**
   * Добавляет один комментарий к модели
   * @param {Comment} comment
   */
  addComment(comment) {
    const index = findObjectIndexInArrayById(this._comments, comment.id);

    if (index > 0) {
      return;
    }

    this._comments.push(comment);
  }

  /**
   * Возвращает массив комментариев
   * @return {{}[]}
   */
  getComments() {
    return this._comments;
  }

  /**
   * Поиск комментария по ID
   * @param {string} id
   * @return {{}}
   */
  find(id) {
    return this._comments.find((comment) => comment.id === id);
  }

  /**
   * Добавление комментария в модель
   * @param {{}} comment
   */
  add(comment) {
    this._comments.push(comment);
  }

  /**
   * Удаляет комментарий из модели
   * @param {string} id
   */
  remove(id) {
    const index = findObjectIndexInArrayById(this._comments, id);
    this.setComments(deleteFromArray(this._comments, index));
  }

}
