import Comment from "../models/comment";
import CommentComponent from "../components/comment";

import {componentRender} from "../utils/render";

import {shake} from "../utils/effects";

/**
 * Состояния кнопки удаления
 * @type {{}}
 */
const DELETE_BTN_STATE = {
  READY: `Delete`,
  BUSY: `Deleting...`,
};

/**
 * Контроллер для комментария
 */
export default class CommentController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {{}} commentsModel
   * @param {function} removeComment
   * @param {function} updateComments
   * @param {API|Provider} api
   */
  constructor(container, commentsModel, removeComment, updateComments, api) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._api = api;

    this._comment = Comment.parseComment({});
    this._commentComponent = null;

    this._removeComment = removeComment;
    this._updateComments = updateComments;

    this._deleteCommentBtnClickHandler = this._deleteCommentBtnClickHandler.bind(this);
  }

  /**
   * Отрисовка комментария
   * @param {string} commentId
   */
  render(commentId) {
    this._comment = this._commentsModel.find(commentId);
    this._commentComponent = new CommentComponent(this._comment);

    componentRender(this._container, this._commentComponent);

    this._commentComponent.setDeleteBtnClickHandler(this._deleteCommentBtnClickHandler);
  }

  /**
   * Добавляет комментарий
   * @param {number} movieId
   * @param {Comment} comment
   * @return {Promise}
   */
  addComment(movieId, comment) {
    comment.date = new Date();
    this._comment = comment;
    return this._api.addComment(movieId, comment)
      .then((comments) => {
        this._updateComments(Comment.parseComments(comments));
      });
  }

  /**
   * Удаляет комментарий
   * @param {number} commentId
   */
  deleteComment(commentId) {
    this._api.deleteComment(commentId)
      .then(() => {
        this._removeComment(commentId);
      })
      .catch(() => {
        const deleteBtn = this._commentComponent.getElement().querySelector(`.film-details__comment-delete`);
        shake(this._commentComponent);
        deleteBtn.disabled = false;
        deleteBtn.textContent = DELETE_BTN_STATE.READY;
      });
  }

  /**
   * Обработчик клика на кнопку удаления комментария
   * @param {Event} event
   * @private
   */
  _deleteCommentBtnClickHandler(event) {
    event.preventDefault();

    const deleteBtn = this._commentComponent.getElement().querySelector(`.film-details__comment-delete`);
    deleteBtn.disabled = true;
    deleteBtn.textContent = DELETE_BTN_STATE.BUSY;

    const commentId = event.target.dataset.target;
    this.deleteComment(commentId);
  }

}
