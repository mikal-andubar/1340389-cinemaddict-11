/**
 * Модель данных для комментариев
 */
export default class Comments {

  /**
   * Конструктор класса
   */
  constructor() {
    this._comments = [];
  }

  /**
   * Устанавливает массив комментариев
   * @param {{}[]} comments
   */
  setComments(comments) {
    this._comments = comments;
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
    const index = this._comments.findIndex((comment) => comment.id === id);
    this.setComments([].concat(this._comments.slice(0, index), this._comments.slice(index + 1)));
  }

}
