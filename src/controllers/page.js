import MovieList, {MovieListType} from "../components/movie-list";
import ShowMoreButton from "../components/show-more-button";
import MovieBoard from "../components/movie-board";
import Sort from "../components/sort";
import MovieController from "./movie";

import {remove, componentRender} from "../utils/render";
import {increaseInt, getSortedMoviesBySortType} from "../utils/common";

import {MOVIE_COUNT, SortType} from "../constants";
import Statistics from "../components/statistics";

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
   * @param {{}} userProfile
   * @param {{}} moviesModel
   * @param {{}} commentsModel
   * @param {{}} filterController
   */
  constructor(container, userProfile, moviesModel, commentsModel, filterController) {
    this._container = container;
    this._userProfile = userProfile;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterController = filterController;

    this._movieBoard = new MovieBoard();
    this._statisticsComponent = new Statistics(this._userProfile, this._moviesModel);
    this._mainMovieList = new MovieList(`All movies. Upcoming`);
    this._emptyMovieList = new MovieList(`There are no movies in our database`, MovieListType.EMPTY);
    this._topRatedList = new MovieList(`Top rated`, MovieListType.EXTRA);
    this._mostCommentedList = new MovieList(`Most commented`, MovieListType.EXTRA);

    this._showMoreBtn = new ShowMoreButton();

    this._sort = new Sort();

    this._shownMoviesControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onSortTypeChangeHandler = this._onSortTypeChangeHandler.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatisticsView = this._onStatisticsView.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);

    this._filterController.setStatisticsViewHandler(this._onStatisticsView);
  }

  /**
   * Отрисовка страницы
   */
  render() {
    const movies = this._moviesModel.getMovies();

    componentRender(this._container, this._sort);

    // Рендер доски со списками фильмов
    componentRender(this._container, this._movieBoard);

    // Рендер пустого списка фильмов
    if (movies.length === 0) {
      componentRender(this._movieBoard.getElement(), this._emptyMovieList);
      return;
    }

    // Рендер основного списка фильмов и карточек в него
    componentRender(this._movieBoard.getElement(), this._mainMovieList);
    const newMovies = this._renderMovieList(this._mainMovieList, movies.slice(0, MOVIE_COUNT.ON_START));
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

    // Рендер экрана статистика
    componentRender(this._container, this._statisticsComponent);
    this._statisticsComponent.hide();

    // Добавление обработчика события смены типа сортировки
    this._sort.setSortTypeChangeHandler(this._onSortTypeChangeHandler);
  }

  _updateMovieList(movieList, count) {

    const newMovies = this._renderMovieList(movieList, this._moviesModel.getMovies().slice(0, count));
    this._refreshMovieControllersInList(movieList.getListType(), newMovies);

    this._renderShowMoreBtn();
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
          this._commentsModel,
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
    remove(this._showMoreBtn);

    if (this._countShownMovies(this._mainMovieList) >= this._moviesModel.getMovies().length) {
      return;
    }

    componentRender(this._mainMovieList.getElement(), this._showMoreBtn);

    this._showMoreBtn.setOnClickHandler(this._onShowMoreBtnClick);
  }

  /**
   * Обработчик события клика по кнопке "Show More"
   */
  _onShowMoreBtnClick() {
    const previouslyShown = this._countShownMovies(this._mainMovieList);
    const newAmount = increaseInt(previouslyShown, MOVIE_COUNT.ON_BTN);

    const renderedMovies = this._renderMovieList(
        this._mainMovieList,
        this._sort.getSortedMovies(this._moviesModel.getMovies(), previouslyShown, newAmount)
    );
    this._pushRenderedMovies(renderedMovies);

    if (newAmount >= this._moviesModel.getMovies().length) {
      remove(this._showMoreBtn);
    }
  }

  /**
   * Подсчитывает количество отображенных карточек в списке
   * @param {{}} movieList
   * @return {number}
   * @private
   */
  _countShownMovies(movieList) {
    return this._shownMoviesControllers.filter(
        (controller) => controller.getListType() === movieList.getListType()
    ).length;
  }

  _onSortTypeChangeHandler() {
    this._mainMovieList.clearList();

    const renderedMovies = this._renderMovieList(
        this._mainMovieList,
        this._sort.getSortedMovies(this._moviesModel.getMovies(), 0, MOVIE_COUNT.ON_START)
    );
    this._refreshMovieControllersInList(MovieListType.MAIN, renderedMovies);

    this._renderShowMoreBtn();
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
    this._shownMoviesControllers.forEach((controller) => {
      if (controller.getListType() === listType) {
        controller.destroy();
      }
    });
    this._shownMoviesControllers = this._shownMoviesControllers.filter(
        (controller) => controller.getListType() !== listType
    );
    this._pushRenderedMovies(renderedMovies);
  }

  /**
   * Обработчик изменения данных задачи
   * @param {{}} oldData
   * @param {{}} newData
   * @private
   */
  _onDataChange(oldData, newData) {
    const movies = this._moviesModel.getAllMovies();
    const index = movies.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._moviesModel.setMovies([].concat(movies.slice(0, index), newData, movies.slice(index + 1)));

    this._shownMoviesControllers.forEach((controller) => {
      controller.changeData(oldData, newData);
    });

    this._filterController.refresh();
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

  /**
   * Обработчик смены фильтра
   * @private
   */
  _onFilterChange() {
    this._sort.setCurrentSortType(SortType.DEFAULT);
    this._updateMovieList(this._mainMovieList, MOVIE_COUNT.ON_START);
    this._statisticsComponent.hide();
    this._movieBoard.show();
  }

  /**
   * Обработчик переключения на просмотр статистики
   * @private
   */
  _onStatisticsView() {
    this._movieBoard.hide();
    this._statisticsComponent.show();
  }
}
