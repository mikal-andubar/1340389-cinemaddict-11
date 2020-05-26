import MovieList from "../components/movie-list";
import ShowMoreButton from "../components/show-more-button";
import MovieBoard from "../components/movie-board";
import Sort from "../components/sort";
import Statistics from "../components/statistics";
import MovieController from "./movie";

import {remove, componentRender} from "../utils/render";
import {increaseInt, getSortedMoviesBySortType} from "../utils/common";

import {MOVIE_COUNT, MovieListKey, SortType} from "../constants";
import {MovieListConfig} from "../config";

/**
 * Отбирает топовые фильмы по определенному параметру
 * @param {Movie[]} movies
 * @param {string} property
 * @param {number} count
 * @return {Movie[]}
 */
const getTopMovies = (movies, property = SortType.RATING, count = MOVIE_COUNT.EXTRA) => {
  const sortedMovies = getSortedMoviesBySortType(movies, property);
  const example = sortedMovies[0][property];
  const top = example.length ? example.length : example;
  if (top === 0) {
    return [];
  }
  return sortedMovies.slice(0, count);
};

/**
 * Контроллер, который управляет рендером элементов страницы
 */
export default class PageController {
  /**
   * Конструктор принимает на вход контейнер, куда будет все отрисовывать
   * @param {Element} container
   * @param {UserProfile} userProfile
   * @param {Movies} moviesModel
   * @param {Comments} commentsModel
   * @param {FilterController} filterController
   * @param {API|Provider} api
   */
  constructor(container, userProfile, moviesModel, commentsModel, filterController, api) {
    this._container = container;
    this._userProfile = userProfile;
    this._moviesModel = moviesModel;
    this._commentsModel = commentsModel;
    this._filterController = filterController;

    this._api = api;

    this._movieBoard = new MovieBoard();

    this._movieLists = Object.values(MovieListConfig).reduce((acc, list) => {
      acc[list.name] = new MovieList(list);
      return acc;
    }, {});

    this._showMoreBtn = new ShowMoreButton();

    this._sort = new Sort();

    this._shownMoviesControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onSortTypeChangeHandler = this._onSortTypeChangeHandler.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatisticsView = this._onStatisticsView.bind(this);
    this._updateExtraLists = this._updateExtraLists.bind(this);

    this._updateMovie = this._updateMovie.bind(this);

    this._statisticsComponent = new Statistics(this._userProfile, this._moviesModel);

  }

  /**
   * Первияная отрисовка страницы
   */
  init() {
    componentRender(this._container, this._sort);

    // Рендер доски со списками фильмов
    componentRender(this._container, this._movieBoard);

    // Рендер лоадера
    componentRender(this._movieBoard.getElement(), this._movieLists[MovieListKey.LOADING]);

    // Рендер экрана статистики
    componentRender(this._container, this._statisticsComponent);
    this._statisticsComponent.hide();
  }

  /**
   * Полноценная отрисовка страницы
   */
  render() {
    // Уберем заглушку с лоадером
    remove(this._movieLists[MovieListKey.LOADING]);

    const movies = this._moviesModel.getMovies();

    // Рендер пустого списка, если не удалось загрузить фильмы
    if (movies.length === 0) {
      this.renderEmpty();
      return;
    }

    // Рендер основного списка фильмов и карточек в него
    componentRender(this._movieBoard.getElement(), this._movieLists[MovieListKey.MAIN]);
    const newMovies = this._renderMovieList(this._movieLists[MovieListKey.MAIN], movies.slice(0, MOVIE_COUNT.ON_START));
    this._pushRenderedMovies(newMovies);

    // Рендер кнопки SHOW MORE
    this._renderShowMoreBtn();

    // Рендер самых высокооцененных фильмов
    const topRatedMovies = getTopMovies(movies, SortType.RATING);
    if (topRatedMovies.length > 0) {
      componentRender(this._movieBoard.getElement(), this._movieLists[MovieListKey.TOP_RATED]);
      const topRatedMovieControllers = this._renderMovieList(this._movieLists[MovieListKey.TOP_RATED], topRatedMovies);
      this._pushRenderedMovies(topRatedMovieControllers);
    }

    // Рендер самых обсуждаемых фильмов
    const mostCommentedMovies = getTopMovies(movies, SortType.COMMENTS); // getMostCommentedMovies(movies);
    if (mostCommentedMovies.length > 0) {
      componentRender(this._movieBoard.getElement(), this._movieLists[MovieListKey.MOST_COMMENTED]);
      const mostCommentedMovieControllers = this._renderMovieList(this._movieLists[MovieListKey.MOST_COMMENTED], mostCommentedMovies);
      this._pushRenderedMovies(mostCommentedMovieControllers);
    }

    // Установка обработчиков
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._filterController.setStatisticsViewHandler(this._onStatisticsView);
    this._sort.setSortTypeChangeHandler(this._onSortTypeChangeHandler);
  }

  // Рендер пустого списка в случае ошибки или если в базе нет фильмов
  renderEmpty() {
    componentRender(this._movieBoard.getElement(), this._movieLists[MovieListKey.EMPTY]);
  }

  /**
   * Возвращает фильмы для указанного списка
   * @param {string} movieListName
   * @param {number} count
   * @return {[]}
   * @private
   */
  _getMoviesForList(movieListName, count) {
    const movies = this._moviesModel.getAllMovies();

    switch (movieListName) {
      case MovieListKey.MAIN:
        return this._renderMovieList(this._movieLists[MovieListKey.MAIN], this._moviesModel.getMovies().slice(0, count));
      case MovieListKey.TOP_RATED:
        return this._renderMovieList(this._movieLists[MovieListKey.TOP_RATED], getTopMovies(movies, SortType.RATING, count));
      case MovieListKey.MOST_COMMENTED:
        return this._renderMovieList(this._movieLists[MovieListKey.MOST_COMMENTED], getTopMovies(movies, SortType.COMMENTS, count));
      default:
        return [];
    }
  }

  /**
   * Обновляет список фильмов
   * @param {MovieList} movieList
   * @param {number} count
   * @private
   */
  _updateMovieList(movieList, count) {
    const listName = movieList.getListConfig().name;
    const newMovies = this._getMoviesForList(listName, count);
    this._refreshMovieControllersInList(listName, newMovies);

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
          movieList.getListConfig().name,
          this._commentsModel,
          this._onDataChange,
          this._onViewChange,
          this._updateExtraLists,
          this._api
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

    if (this._countShownMovies(this._movieLists[MovieListKey.MAIN]) >= this._moviesModel.getMovies().length) {
      return;
    }

    componentRender(this._movieLists[MovieListKey.MAIN].getElement(), this._showMoreBtn);

    this._showMoreBtn.setOnClickHandler(this._onShowMoreBtnClick);
  }

  /**
   * Обработчик события клика по кнопке "Show More"
   */
  _onShowMoreBtnClick() {
    const previouslyShown = this._countShownMovies(this._movieLists[MovieListKey.MAIN]);
    const newAmount = increaseInt(previouslyShown, MOVIE_COUNT.ON_BTN);

    const renderedMovies = this._renderMovieList(
        this._movieLists[MovieListKey.MAIN],
        this._sort.getSortedMovies(this._moviesModel.getMovies(), previouslyShown, newAmount)
    );
    this._pushRenderedMovies(renderedMovies);

    if (newAmount >= this._moviesModel.getMovies().length) {
      remove(this._showMoreBtn);
    }
  }

  /**
   * Подсчитывает количество отображенных карточек в списке
   * @param {MovieList} movieList
   * @return {number}
   * @private
   */
  _countShownMovies(movieList) {
    return this._shownMoviesControllers.filter(
        (controller) => controller.getMovieListName() === movieList.getListConfig().name
    ).length;
  }

  _onSortTypeChangeHandler() {
    this._movieLists[MovieListKey.MAIN].clearList();

    const renderedMovies = this._renderMovieList(
        this._movieLists[MovieListKey.MAIN],
        this._sort.getSortedMovies(this._moviesModel.getMovies(), 0, MOVIE_COUNT.ON_START)
    );
    this._refreshMovieControllersInList(MovieListKey.MAIN, renderedMovies);

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
   * @param {string} listName
   * @param {MovieController[]} renderedMovies
   * @private
   */
  _refreshMovieControllersInList(listName, renderedMovies) {
    this._shownMoviesControllers.forEach((controller) => {
      if (controller.getMovieListName() === listName) {
        controller.destroy();
      }
    });
    this._shownMoviesControllers = this._shownMoviesControllers.filter(
        (controller) => controller.getMovieListName() !== listName
    );
    this._pushRenderedMovies(renderedMovies);
  }

  /**
   * Обработчик изменения данных задачи
   * @param {Movie} newData
   * @private
   */
  _onDataChange(newData) {
    this._api.updateMovie(newData)
      .then(this._updateMovie);
  }

  /**
   * Обновление данных о фильме в модели и интерфейсе
   * @param {Movie} movie
   * @private
   */
  _updateMovie(movie) {
    const isSuccess = this._moviesModel.updateMovie(movie);

    if (isSuccess) {
      this._shownMoviesControllers.forEach((controller) => {
        controller.changeData(movie);
      });
      this._filterController.refresh();

      this._userProfile.refreshUser();
    }
  }

  /**
   * Обновление дополнительных списков фильмов
   * @private
   */
  _updateExtraLists() {
    this._updateMovieList(this._movieLists[MovieListKey.TOP_RATED], MOVIE_COUNT.EXTRA);
    this._updateMovieList(this._movieLists[MovieListKey.MOST_COMMENTED], MOVIE_COUNT.EXTRA);
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
    this._updateMovieList(this._movieLists[MovieListKey.MAIN], MOVIE_COUNT.ON_START);
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
