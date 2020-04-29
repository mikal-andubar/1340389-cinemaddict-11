import {KEY_CODE, MovieCardButton, MovieCardModes} from "../constants";
import MovieCard from "../components/movie-card";
import MoviePopup from "../components/movie-popup";
import {componentRender, replace} from "../utils/render";

/**
 * Класс контроллера для карточки с фильмом
 */
export default class MovieController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {string} listType
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, listType, onDataChange, onViewChange) {
    this._container = container;
    this._listType = listType;
    this._movie = {};

    this._mode = MovieCardModes.DEFAULT;

    this._movieCard = null;
    this._moviePopup = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._showMoviePopup = this._showMoviePopup.bind(this);
    this._hideMoviePopup = this._hideMoviePopup.bind(this);
    this._onEscBtnDown = this._onEscBtnDown.bind(this);
    this._onMovieCardBtnClick = this._onMovieCardBtnClick.bind(this);
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
    this._moviePopup = new MoviePopup(this._movie);

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
    if (oldData !== this._movie) {
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
   * Обработчик событий по кнопкам на карточке фильма
   * @param {Event} event
   * @private
   */
  _onMovieCardBtnClick(event) {
    event.preventDefault();

    const buttonType = event.currentTarget.dataset.type;
    const property = MovieCardButton[buttonType].property;

    this._onDataChange(this._movie, Object.assign({}, this._movie, {
      [property]: !this._movie[property],
    }));
  }

  /**
   * Показывает попап с детальной информацией о фильме
   */
  _showMoviePopup() {
    this._onViewChange();
    componentRender(document.body, this._moviePopup);
    this._moviePopup.setOnPopupCloseClickHandler(this._hideMoviePopup);
    document.addEventListener(`keydown`, this._onEscBtnDown);
    this._mode = MovieCardModes.POPUP;
  }

  /**
   * Скрывает попап с детальной информацией о фильме
   */
  _hideMoviePopup() {
    document.body.removeChild(this._moviePopup.getElement());
    this._moviePopup.removeElement();
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

}
