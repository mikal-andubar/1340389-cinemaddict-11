import MovieList, {MovieListType} from "../components/movie-list";
import ShowMoreButton from "../components/show-more-button";
import MovieBoard from "../components/movie-board";
import Sort from "../components/sort";
import Filter from "../components/filter";
import MovieController from "./movie";

import {remove, componentRender} from "../utils/render";
import {increaseInt, getSortedMoviesBySortType} from "../utils/common";

import {MOVIE_COUNT, SortType} from "../constants";

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
     * Кнопка SHOW MORE
     * @type {ShowMoreButton}
     * @private
     */
    this._showMoreBtn = new ShowMoreButton();

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
     * Состояние отображения кнопки "Show More"
     * @type {boolean}
     * @private
     */
    this._showShowMoreBtn = false;

    /**
     * Массив фильмов
     * @type {{}[]}
     * @private
     */
    this._movies = [];

    /**
     * Массив контроллеров карточек с фильмами
     * @type {*[]}
     * @private
     */
    this._shownMoviesControllers = [];

    /**
     * Количество показанных в данный момент фильмов
     * @type {number}
     * @private
     */
    this._shownMovies = 0;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onSortTypeChangeHandler = this._onSortTypeChangeHandler.bind(this);
  }

  /**
   * Отрисовка страницы
   * @param {{}[]} movies
   */
  render(movies) {
    this._movies = movies;

    // Рендер меню фильтров и сортировки
    this._filter.setMovies(this._movies);
    componentRender(this._container, this._filter);
    componentRender(this._container, this._sort);

    // Рендер доски со списками фильмов
    componentRender(this._container, this._movieBoard);

    // Рендер пустого списка фильмов
    if (this._movies.length === 0) {
      componentRender(this._movieBoard.getElement(), this._emptyMovieList);
      return;
    }

    this._shownMovies = MOVIE_COUNT.ON_START;

    // Рендер основного списка фильмов и карточек в него
    componentRender(this._movieBoard.getElement(), this._mainMovieList);
    const newMovies = this._renderMovieList(this._mainMovieList, this._movies.slice(0, this._shownMovies));
    this._pushRenderedMovies(newMovies);

    this._renderShowMoreBtn();

    // Рендер самых высокооцененных фильмов
    componentRender(this._movieBoard.getElement(), this._topRatedList);
    const topRatedMovies = this._renderMovieList(this._topRatedList, getTopRatedMovies(movies));
    this._pushRenderedMovies(topRatedMovies);

    // Рендер самых обсуждаемых фильмов
    componentRender(this._movieBoard.getElement(), this._mostCommentedList);
    const mostCommentedMovies = this._renderMovieList(this._mostCommentedList, getMostCommentedMovies(movies));
    this._pushRenderedMovies(mostCommentedMovies);

    // Добавление обработчика события смены типа сортировки
    this._sort.setSortTypeChangeHandler(this._onSortTypeChangeHandler);
  }

  /**
   * Рендер списка фильмов
   * @param {MovieList} movieList
   * @param {[]} movies
   * @return {MovieController[]}
   */
  _renderMovieList(movieList, movies = []) {
    return movies.map((movie) => {
      const movieController = new MovieController(
          movieList.getListElement(),
          movieList.getListType(),
          this._onDataChange,
          this._onViewChange
      );

      movieController.render(movie);

      return movieController;
    });
  }

  /**
   * Рендер кнопки "Show More"
   */
  _renderShowMoreBtn() {
    if (this._shownMovies > this._movies.length) {
      return;
    }

    componentRender(this._mainMovieList.getElement(), this._showMoreBtn);

    this._showMoreBtn.setOnClickHandler(this._onShowMoreBtnClick);

    this._showShowMoreBtn = true;
  }

  /**
   * Обработчик события клика по кнопке "Show More"
   */
  _onShowMoreBtnClick() {
    const previouslyShown = this._shownMovies;
    this._shownMovies = increaseInt(this._shownMovies, MOVIE_COUNT.ON_BTN);

    const renderedMovies = this._renderMovieList(
        this._mainMovieList,
        this._sort.getSortedMovies(this._movies, previouslyShown, this._shownMovies)
    );
    this._pushRenderedMovies(renderedMovies);

    if (this._shownMovies >= MOVIE_COUNT.TOTAL) {
      remove(this._showMoreBtn);
      this._showShowMoreBtn = false;
    }
  }

  _onSortTypeChangeHandler() {
    this._shownMovies = MOVIE_COUNT.ON_START;

    this._mainMovieList.clearList();

    const renderedMovies = this._renderMovieList(
        this._mainMovieList,
        this._sort.getSortedMovies(this._movies, 0, this._shownMovies)
    );
    this._refreshMovieControllersInList(MovieListType.MAIN, renderedMovies);

    if (!this._showShowMoreBtn) {
      this._renderShowMoreBtn();
    }
  }

  /**
   * Добавляет контроллеры отрендереных фильмов в массив контроллеров
   * @param {MovieController[]} renderedMovies
   * @private
   */
  _pushRenderedMovies(renderedMovies) {
    this._shownMoviesControllers = this._shownMoviesControllers.concat(renderedMovies);
  }

  /**
   * Обновляет массив контроллеров для заданного типа списка фильмов
   * @param {string} listType
   * @param {MovieController[]} renderedMovies
   * @private
   */
  _refreshMovieControllersInList(listType, renderedMovies) {
    this._shownMoviesControllers = this._shownMoviesControllers.filter((controller) => controller.getListType() !== listType);
    this._pushRenderedMovies(renderedMovies);
  }

  /**
   * Обработчик изменения данных задачи
   * @param {{}} oldData
   * @param {{}} newData
   * @private
   */
  _onDataChange(oldData, newData) {
    const index = this._movies.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._movies = [].concat(this._movies.slice(0, index), newData, this._movies.slice(index + 1));

    this._shownMoviesControllers.forEach((controller) => {
      controller.changeData(oldData, newData);
    });
  }

  /**
   * Обработчик переключения режимов отображения карточки с фильмом
   * @private
   */
  _onViewChange() {
    this._shownMoviesControllers.forEach((controller) => {
      controller.setDefaultView();
    });
  }
}
