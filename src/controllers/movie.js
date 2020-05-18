import {KEY_CODE, MOVIE_BUTTON, MovieCardButton, MovieCardModes} from "../constants";
import MovieCard from "../components/movie-card";
import MoviePopup from "../components/movie-popup";
import {componentRender, remove, replace} from "../utils/render";
import CommentController from "./comment";

/**
 * Класс контроллера для карточки с фильмом
 */
export default class MovieController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {string} listType
   * @param {{}} commentsModel
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, listType, commentsModel, onDataChange, onViewChange) {
    this._container = container;
    this._listType = listType;
    this._commentsModel = commentsModel;
    this._movie = {};

    this._mode = MovieCardModes.DEFAULT;

    this._movieCard = null;
    this._moviePopup = null;

    this._commentControllers = [];


    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._showMoviePopup = this._showMoviePopup.bind(this);
    this._hideMoviePopup = this._hideMoviePopup.bind(this);

    this._onEscBtnDown = this._onEscBtnDown.bind(this);

    this._onMovieCardBtnClick = this._onMovieCardBtnClick.bind(this);

    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._commentTextEntryHandler = this._commentTextEntryHandler.bind(this);
    this._submitCommentFormHandler = this._submitCommentFormHandler.bind(this);
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
  getListType() {
    return this._listType;
  }

  /**
   * Изменение данных и перерисовка компонента
   * @param {{}} oldData
   * @param {{}} newData
   */
  changeData(oldData, newData) {
    if (oldData.id !== this._movie.id) {
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
      replace(this._movieCard, oldMovieCard);
      replace(this._moviePopup, oldMoviePopup);
    } else {
      componentRender(this._container, this._movieCard);
    }
    if (this._mode === MovieCardModes.POPUP) {
      this._renderCommentsList(this._movie.comments);
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
   * @param {[]} commentIds
   * @private
   */
  _renderCommentsList(commentIds) {
    this._commentControllers = commentIds.map((commentId) => {
      const commentController = new CommentController(
          this._moviePopup.getElement().querySelector(`.film-details__comments-list`),
          this._commentsModel,
          this._onCommentsDataChange
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
    this._renderCommentsList(this._movie.comments);

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

    const changingData = {[property]: !this._movie[property]};
    if (property === MovieCardButton[[MOVIE_BUTTON.WATCHED]].property && changingData[property]) {
      changingData.watchingDate = new Date();
    }

    const newData = Object.assign({}, this._movie, changingData);

    this._onDataChange(this._movie, newData);
  }

  /**
   * Обработчик клика по эмодзи
   * @param {Event} event
   * @private
   */
  _emojiClickHandler(event) {
    const emojiName = event.currentTarget.value;
    this._moviePopup.setCurrentEmoji(emojiName);

    this._refreshMoviePopup();
  }

  /**
   * Обработка ввода текста комментария
   * @param {Event} event
   * @private
   */
  _commentTextEntryHandler(event) {
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
      const newCommentController = new CommentController(
          this._moviePopup.getElement().querySelector(`.film-details__comments-list`),
          this._commentsModel,
          this._onCommentsDataChange
      );
      newCommentController.addComment(this._moviePopup.getNewComment());
    }
  }

  /**
   * Обработчик изменения комментариев
   * @param {{}} oldData
   * @param {{}} newData
   * @private
   */
  _onCommentsDataChange(oldData, newData) {
    switch (true) {
      case newData === null:
        this._removeCommentFromMovie(oldData.id);
        this._commentsModel.remove(oldData.id);

        this._onDataChange(this._movie, this._movie);
        this._refreshMoviePopup();
        break;
      case oldData === null:
        this._commentsModel.add(newData);
        this._addCommentToMovie(newData);
        this._moviePopup.emptyNewComment();

        this._onDataChange(this._movie, this._movie);
        this._refreshMoviePopup();
        break;
    }
  }

  /**
   * Обновляет попап с подробной информацией
   * @private
   */
  _refreshMoviePopup() {
    this._moviePopup.rerender();
    this._renderCommentsList(this._movie.comments);
  }

  /**
   * Добавляет комментарий к текущему фильму
   * @param {{}} comment
   * @private
   */
  _addCommentToMovie(comment) {
    this._movie.comments.push(comment.id);
  }

  /**
   * Удаляет комментарий по ID из текущего фильма
   * @param {string} commentId
   * @private
   */
  _removeCommentFromMovie(commentId) {
    const movie = this._movie;
    if (this._movie === {}) {
      return;
    }
    const comments = movie.comments;
    const index = comments.findIndex((it) => it === commentId);
    if (index === -1) {
      return;
    }
    movie.comments = [].concat(comments.slice(0, index), comments.slice(index + 1));
  }

}
