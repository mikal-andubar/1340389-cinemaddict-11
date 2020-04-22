import MovieCard from "../components/movie-card";
import MoviePopup from "../components/movie-popup";
import MovieList, {MovieListType} from "../components/movie-list";
import ShowMoreButton from "../components/show-more-button";
import MovieBoard from "../components/movie-board";
import Statistics from "../components/statistics";
import Sort, {getSortedMoviesBySortType, SortType} from "../components/sort";
import Filter from "../components/filter";

import {remove, componentRender} from "../utils/render";
import {increaseInt} from "../utils/common";

import {KEY_CODE, MOVIE_COUNT} from "../constatnts";

/**
 * Поиск фильмов с наивысшими оценками
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
const getTopRatedMovies = (movies, count = MOVIE_COUNT.EXTRA) => (
  getSortedMoviesBySortType(movies, SortType.RATING).slice(0, count)
);

/**
 * Поиск фильмов с самым большим количеством комментариев
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
const getMostCommentedMovies = (movies, count = MOVIE_COUNT.EXTRA) => (
  getSortedMoviesBySortType(movies, SortType.COMMENTS).slice(0, count)
);

/**
 * Контроллер, который управляет рендером элементов страницы
 */
export default class PageController {
  /**
   * Конструктор принимает на вход контейнер, куда будет все отрисовывать
   * @param {Element} container
   */
  constructor(container) {
    /**
     * Контейнер, куда все отрисовывается
     * @type {Element}
     * @private
     */
    this._container = container;

    /**
     * Доска со всеми списками фильмов
     * @type {MovieBoard}
     * @private
     */
    this._movieBoard = new MovieBoard();

    /**
     * Главный список фильмов
     * @type {MovieList}
     */
    this._mainMovieList = new MovieList(`All movies. Upcoming`);

    /**
     * Пустой список фильмов
     * @type {MovieList}
     */
    this._emptyMovieList = new MovieList(`There are no movies in our database`, MovieListType.EMPTY);

    /**
     * Список фильмов с самым высоким рейтингом
     * @type {MovieList}
     */
    this._topRatedList = new MovieList(`Top rated`, MovieListType.EXTRA);

    /**
     * Список самых обсуждаемых фильмов
     * @type {MovieList}
     */
    this._mostCommentedList = new MovieList(`Most commented`, MovieListType.EXTRA);

    /**
     * Сортировка
     * @type {Sort}
     * @private
     */
    this._sort = new Sort();

    /**
     * Фильтры
     * @type {Filter}
     * @private
     */
    this._filter = new Filter();

    /**
     * Подвал сайта
     * @type {Element}
     */
    this._footerElement = this._container.nextElementSibling;

    /**
     * Состояние отображения кнопки "Show More"
     * @type {boolean}
     * @private
     */
    this._showShowMoreBtn = false;
  }

  /**
   * Рендер карточки фильма
   * @param {Element} movieListElement
   * @param {{}} movie
   */
  _renderMovieCard(movieListElement, movie) {
    /**
     * Скрывает попап
     */
    const hidePopup = () => {
      this._footerElement.removeChild(moviePopup.getElement());
      document.removeEventListener(`keydown`, onEscBtnDown);
    };

    /**
     * Обработчик события клика по карточке фильма
     */
    const onPopupOpenClick = () => {
      this._footerElement.appendChild(moviePopup.getElement());
      document.addEventListener(`keydown`, onEscBtnDown);
    };

    /**
     * Обработчик нажатия на кнопку Escape
     * @param {KeyboardEvent} event
     */
    const onEscBtnDown = (event) => {
      const isEscBtn = event.key === KEY_CODE.ESCAPE || event.key === KEY_CODE.ESC;

      if (isEscBtn) {
        hidePopup();
      }
    };

    // Создание карточки фильма
    const movieCard = new MovieCard(movie);
    movieCard.setOnPopupOpenClickHandler(onPopupOpenClick);

    // Созадание попапа
    const moviePopup = new MoviePopup(movie);
    moviePopup.setOnPopupCloseClickHandler(hidePopup);

    // Рендер карточки фильма
    componentRender(movieListElement, movieCard);
  }

  /**
   * Рендер списка фильмов
   * @param {MovieList} movieList
   * @param {[]} movies
   */
  _renderMovieList(movieList, movies = []) {
    movies.forEach((movie) => this._renderMovieCard(movieList.getElement().querySelector(`.films-list__container`), movie));
  }

  /**
   * Отрисовка страницы
   * @param {{}[]} movies
   */
  render(movies) {
    /**
     * Обработчик события клика по кнопке "Show More"
     */
    const onShowMoreBtnClick = () => {
      const previouslyShown = shownMovies;
      shownMovies = increaseInt(shownMovies, MOVIE_COUNT.ON_BTN);

      this._renderMovieList(this._mainMovieList, this._sort.getSortedMovies(movies, previouslyShown, shownMovies));

      if (shownMovies >= MOVIE_COUNT.TOTAL) {
        remove(showMoreBtn);
        this._showShowMoreBtn = false;
      }
    };

    /**
     * Рендер кнопки "Show More"
     */
    const renderShowMoreBtn = () => {
      if (shownMovies > movies.length) {
        return;
      }

      componentRender(this._mainMovieList.getElement(), showMoreBtn);

      showMoreBtn.setOnClickHandler(onShowMoreBtnClick);

      this._showShowMoreBtn = true;
    };

    // Рендер меню фильтров и сортировки
    this._filter.setMovies(movies);
    componentRender(this._container, this._filter);
    componentRender(this._container, this._sort);

    // Рендер доски со списками фильмов
    componentRender(this._container, this._movieBoard);

    // Рендер пустого списка фильмов
    if (movies.length === 0) {
      componentRender(this._movieBoard.getElement(), this._emptyMovieList);
      return;
    }

    /**
     * Количество отображенных карточек на данный момент
     * @type {number}
     */
    let shownMovies = MOVIE_COUNT.ON_START;

    // Рендер основного списка фильмов и карточек в него
    componentRender(this._movieBoard.getElement(), this._mainMovieList);
    this._renderMovieList(this._mainMovieList, movies.slice(0, shownMovies));

    /**
     * Кнопка "Show More"
     * @type {ShowMoreButton}
     */
    const showMoreBtn = new ShowMoreButton();
    renderShowMoreBtn();

    // Рендер самых высокооцененных фильмов
    componentRender(this._movieBoard.getElement(), this._topRatedList);
    this._renderMovieList(this._topRatedList, getTopRatedMovies(movies));

    // Рендер самых обсуждаемых фильмов
    componentRender(this._movieBoard.getElement(), this._mostCommentedList);
    this._renderMovieList(this._mostCommentedList, getMostCommentedMovies(movies));

    /**
     * Раздел для отображения статистики
     * @type {Element}
     */
    const footerStatisticsElement = this._footerElement.querySelector(`.footer__statistics`);
    // Рендер статистики в подвале
    componentRender(footerStatisticsElement, new Statistics(movies.length));

    // Добавление обработчика события смены типа сортировки
    this._sort.setSortTypeChangeHandler(() => {
      shownMovies = MOVIE_COUNT.ON_START;

      this._mainMovieList.clearList();

      this._renderMovieList(this._mainMovieList, this._sort.getSortedMovies(movies, 0, shownMovies));
      if (!this._showShowMoreBtn) {
        renderShowMoreBtn();
      }
    });
  }
}
