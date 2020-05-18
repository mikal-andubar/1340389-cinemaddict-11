/**
 * Контроллер для комментария
 */
import Comment from "../components/comment";
import {componentRender} from "../utils/render";
import {generatePerson, getRandomInt} from "../utils/common";

export default class CommentController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {{}} commentsModel
   * @param {function} onDataChange
   */
  constructor(container, commentsModel, onDataChange) {
    this._container = container;
    this._commentsModel = commentsModel;

    this._comment = null;
    this._commentComponent = null;

    this._onDataChange = onDataChange;

    this._deleteCommentBtnClickHandler = this._deleteCommentBtnClickHandler.bind(this);
  }

  /**
   * Отрисовка комментария
   * @param {string} commentId
   */
  render(commentId) {
    this._comment = this._commentsModel.find(commentId);
    this._commentComponent = new Comment(this._comment);

    componentRender(this._container, this._commentComponent);

    const deleteButton = this._commentComponent.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.addEventListener(`click`, this._deleteCommentBtnClickHandler);
  }

  /**
   * Добавляет комментарий
   * @param {{}} comment
   */
  addComment(comment) {
    comment.author = generatePerson();
    comment.date = new Date();
    comment.id = Date.now().toString() + getRandomInt(1, 1000).toString();
    this._comment = comment;
    this._onDataChange(null, comment);
  }

  /**
   * Обработчик клика на кнопку удаления комментария
   * @param {Event} event
   * @private
   */
  _deleteCommentBtnClickHandler(event) {
    event.preventDefault();

    const commentId = event.target.dataset.target;
    const comment = this._commentsModel.find(commentId);

    this._onDataChange(comment, null);
  }

}
