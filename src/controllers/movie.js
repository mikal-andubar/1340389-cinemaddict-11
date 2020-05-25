import MovieCard from "../components/movie-card";
import MoviePopup from "../components/movie-popup";
import CommentController from "./comment";
import Movie from "../models/movie";

import {componentRender, remove, replace} from "../utils/render";
import {shake} from "../utils/effects";
import {deleteFromArray} from "../utils/common";

import {KEY_CODE, MOVIE_BUTTON, MovieCardModes} from "../constants";
import {MovieCardButton} from "../config";

/**
 * Класс контроллера для карточки с фильмом
 */
export default class MovieController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {string} movieListName
   * @param {{}} commentsModel
   * @param {function} onDataChange
   * @param {function} onViewChange
   * @param {function} askBoardToUpdateLists
   * @param {API} api
   */
  constructor(container,
      movieListName,
      commentsModel,
      onDataChange,
      onViewChange,
      askBoardToUpdateLists,
      api
  ) {
    this._container = container;
    this._movieListName = movieListName;
    this._commentsModel = commentsModel;
    this._movie = {};
    this._api = api;

    this._commentControllers = [];

    this._mode = MovieCardModes.DEFAULT;

    this._movieCard = null;
    this._moviePopup = null;
    this._moviePopupInitialPos = 0;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._showMoviePopup = this._showMoviePopup.bind(this);
    this._hideMoviePopup = this._hideMoviePopup.bind(this);

    this._onEscBtnDown = this._onEscBtnDown.bind(this);

    this._onMovieCardBtnClick = this._onMovieCardBtnClick.bind(this);

    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this._removeComment = this._removeComment.bind(this);
    this._updateComments = this._updateComments.bind(this);

    this._commentTextEntryHandler = this._commentTextEntryHandler.bind(this);
    this._submitCommentFormHandler = this._submitCommentFormHandler.bind(this);

    this._askBoardToUpdateLists = askBoardToUpdateLists;
  }

  /**
   * Отрисовка карточки фильма
   * @param {{}} movie
   */
  render(movie) {
    this._movie = movie;

    const oldMovieCard = this._movieCard;
    const oldMoviePopup = this._moviePopup;

    // Создание карточки фильма
    this._createMovieCard();

    // Созадание попапа
    this._createMoviePopup();

    // Рендер карточки фильма
    this._smartRender(oldMovieCard, oldMoviePopup);
  }

  /**
   * Возвращает тип списка фильмов
   * @return {string}
   */
  getMovieListName() {
    return this._movieListName;
  }

  /**
   * Изменение данных и перерисовка компонента
   * @param {{}} newData
   */
  changeData(newData) {
    if (newData.id !== this._movie.id) {
      return;
    }

    this.render(newData);
  }

  /**
   * Переключает на вид по умолчанию
   */
  setDefaultView() {
    if (this._mode !== MovieCardModes.DEFAULT) {
      this._hideMoviePopup();
    }
  }

  /**
   * Уничтожает карточку с фильмом
   */
  destroy() {
    remove(this._moviePopup);
    remove(this._movieCard);
    document.removeEventListener(`keydown`, this._onEscBtnDown);
  }

  /**
   * Рендер с учетом возможности перерисовки компонентов
   * @param {MovieCard} oldMovieCard
   * @param {MoviePopup} oldMoviePopup
   * @private
   */
  _smartRender(oldMovieCard, oldMoviePopup) {
    if (oldMovieCard && oldMoviePopup) {
      this._moviePopupInitialPos = oldMoviePopup.getCurrentPos();
      replace(this._movieCard, oldMovieCard);
      replace(this._moviePopup, oldMoviePopup);
    } else {
      componentRender(this._container, this._movieCard);
    }
    if (this._mode === MovieCardModes.POPUP) {
      this._refreshMoviePopup();
    }
  }

  /**
   * Создает карточку фильма для данного котроллера
   * @private
   */
  _createMovieCard() {
    this._movieCard = new MovieCard(this._movie);
    this._movieCard.setOnPopupOpenClickHandler(this._showMoviePopup);
    this._movieCard.setMovieCardBtnsHandler(this._onMovieCardBtnClick);
  }

  /**
   * Создает попап с фильмом
   * @private
   */
  _createMoviePopup() {
    this._moviePopup = new MoviePopup(this._movie);

    this._moviePopup.setOnPopupCloseClickHandler(this._hideMoviePopup);
    this._moviePopup.setPopupBtnsHandler(this._onMovieCardBtnClick);
    this._moviePopup.setEmojiClickHandler(this._emojiClickHandler);
    this._moviePopup.setTextEntryHandler(this._commentTextEntryHandler);
    this._moviePopup.setFormSubmitHandler(this._submitCommentFormHandler);
  }

  /**
   * Рендер комментариев
   * @private
   */
  _renderCommentsList() {
    this._commentControllers = this._movie.comments.map((commentId) => {
      const commentController = new CommentController(
          this._moviePopup.getElement().querySelector(`.film-details__comments-list`),
          this._commentsModel,
          this._removeComment,
          this._updateComments,
          this._api
      );
      commentController.render(commentId);

      return commentController;
    });
  }

  /**
   * Показывает попап с детальной информацией о фильме
   */
  _showMoviePopup() {
    this._onViewChange();
    componentRender(document.body, this._moviePopup);

    this._moviePopup.recoveryListeners();
    this._renderCommentsList();

    document.addEventListener(`keydown`, this._onEscBtnDown);
    this._mode = MovieCardModes.POPUP;
  }

  /**
   * Скрывает попап с детальной информацией о фильме
   */
  _hideMoviePopup() {
    document.body.removeChild(this._moviePopup.getElement());
    this._moviePopup.removeElement();
    this._moviePopup.emptyNewComment();
    document.removeEventListener(`keydown`, this._onEscBtnDown);
    this._mode = MovieCardModes.DEFAULT;
    this._askBoardToUpdateLists();
  }

  /**
   * Обработчик нажатия на кнопку Escape
   * @param {KeyboardEvent} event
   */
  _onEscBtnDown(event) {
    const isEscBtn = event.key === KEY_CODE.ESCAPE || event.key === KEY_CODE.ESC;

    if (isEscBtn) {
      this._hideMoviePopup();
    }
  }

  /**
   * Обработчик событий по кнопкам на карточке фильма
   * @param {Event} event
   * @private
   */
  _onMovieCardBtnClick(event) {
    event.preventDefault();

    const buttonType = event.currentTarget.dataset.type;
    const property = MovieCardButton[buttonType].property;

    const newData = Movie.clone(this._movie);
    newData[property] = !this._movie[property];

    // Проверка на то, что фильм только что получил признак "просмотрен"
    const isJustWatched = MovieCardButton[[MOVIE_BUTTON.WATCHED]].property && newData.isWatched;

    if (isJustWatched) {
      newData.watchingDate = new Date();
    }

    this._onDataChange(newData);
  }

  /**
   * Обработчик клика по эмодзи
   * @param {Event} event
   * @private
   */
  _emojiClickHandler(event) {
    const emojiName = event.currentTarget.value;
    this._moviePopup.setCurrentEmoji(emojiName);
    this._moviePopupInitialPos = this._moviePopup.getCurrentPos();

    this._refreshMoviePopup();
  }

  /**
   * Обработка ввода текста комментария
   * @param {Event} event
   * @private
   */
  _commentTextEntryHandler(event) {
    this._moviePopup.refreshNewCommentForm();
    this._moviePopup.setNewCommentText(event.target.value);
  }

  /**
   * Обработчик отправки формы с новым комментарием
   * @param {Event} event
   * @private
   */
  _submitCommentFormHandler(event) {
    if (event.ctrlKey && event.key === KEY_CODE.ENTER) {
      if (!this._moviePopup.getCurrentEmoji()) {
        return;
      }
      this._moviePopup.refreshNewCommentForm();
      this._moviePopup.disableNewCommentForm();

      const newCommentController = new CommentController(
          this._moviePopup.getElement().querySelector(`.film-details__comments-list`),
          this._commentsModel,
          this._removeComment,
          this._updateComments,
          this._api
      );

      this._commentControllers.push(newCommentController);

      newCommentController.addComment(this._movie.id, this._moviePopup.getNewComment())
        .catch(() => {
          shake(this._moviePopup);
          this._moviePopup.enableNewCommentForm();
          this._moviePopup.markNewCommentFormError();
        });
    }
  }

  /**
   * Обновляет комментарии у текущего фильма
   * @param {Comment[]} comments
   * @private
   */
  _updateComments(comments) {
    const newData = Movie.clone(this._movie);
    this._commentsModel.addComments(comments);
    newData.comments = comments.map((comment) => comment.id);
    this._moviePopup.emptyNewComment();

    this._onDataChange(newData);
    this._refreshMoviePopup();
  }

  /**
   * Удаляет один из комментариев с попапа
   * @param {number} commentId
   * @private
   */
  _removeComment(commentId) {
    this._removeCommentFromMovie(commentId);
    this._commentsModel.remove(commentId);
    this._moviePopupInitialPos = this._moviePopup.getCurrentPos();

    this._onDataChange(this._movie);
    this._refreshMoviePopup();
  }

  /**
   * Обновляет попап с подробной информацией
   * @private
   */
  _refreshMoviePopup() {
    this._moviePopup.rerender();
    this._renderCommentsList();
    this._moviePopup.setCurrentPos(this._moviePopupInitialPos);
  }

  /**
   * Удаляет комментарий по ID из текущего фильма
   * @param {string} commentId
   * @private
   */
  _removeCommentFromMovie(commentId) {
    if (this._movie === {}) {
      return;
    }

    const movie = this._movie;
    const comments = movie.comments;
    const index = comments.findIndex((it) => it === commentId);
    if (index === -1) {
      return;
    }

    movie.comments = deleteFromArray(comments, index);
  }

}
