import Filter from "./components/filter";
import MovieBoard from "./components/movie-board";
import MovieCard from "./components/movie-card";
import MovieList from "./components/movie-list";
import MoviePopup from "./components/movie-popup";
import ShowMoreButton from "./components/show-more-button";
import Sort from "./components/sort";
import Statistics from "./components/statistics";
import UserProfile from "./components/user-profile";

import {generateFilters} from "./mock/filters";
import {generateMovies} from "./mock/movie";
import {generateUser} from "./mock/user";
import {render} from "./utils";

import {MOVIE_COUNT} from "./constatnts";

/**
 * Вся шапка сайта
 * @type {Element}
 */
const headerElement = document.querySelector(`.header`);

/**
 * Основной блок страницы
 * @type {Element}
 */
const mainElement = document.querySelector(`.main`);

/**
 * Подвал сайта
 * @type {Element}
 */
const footerElement = document.querySelector(`.footer`);

/**
 * Раздел для отображения статистики
 * @type {Element | any}
 */
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

/**
 * Массив объектов с фильмами
 * @type {{}[]}
 */
const generatedMovies = generateMovies(MOVIE_COUNT.TOTAL);

/**
 * Профиль пользователя
 * @type {UserProfile}
 */
const userProfile = new UserProfile(generateUser(generatedMovies));


/**
 * Поиск фильмов с наивысшими оценками
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
const getTopRatedMovies = (movies, count = MOVIE_COUNT.EXTRA) => movies.slice().sort((a, b) => a.rating > b.rating ? -1 : 1).slice(0, count);

/**
 * Поиск фильмов с самым большим количеством комментариев
 * @param {[]} movies
 * @param {number} count
 * @return {[]}
 */
const getMostCommentedMovies = (movies, count = MOVIE_COUNT.EXTRA) => movies.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1).slice(0, count);

/**
 * Рендер карточки фильма
 * @param {Element} movieListElement
 * @param {{}} movie
 */
const renderMovieCard = (movieListElement, movie) => {
  /**
   * Обработчик события клика по карточке фильма
   */
  const onPopupOpenClick = () => {
    footerElement.appendChild(moviePopup.getElement());
  };

  /**
   * Обработчик события клика по кнопке закрытия попапа
   */
  const onPopupCloseClick = () => {
    footerElement.removeChild(moviePopup.getElement());
  };

  // Создание карточки фильма
  const movieCard = new MovieCard(movie);
  // Добавление обработчика события клика к заголовку, постеру и строке с информацией о комментариях
  const openElements = movieCard.getElement().querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`);
  openElements.forEach(
      (openElement) => openElement.addEventListener(`click`, onPopupOpenClick)
  );

  // Созадание попапа
  const moviePopup = new MoviePopup(movie);
  // Добавление обработчика события клика к кнопке закрытия
  const closePopupBtn = moviePopup.getElement().querySelector(`.film-details__close-btn`);
  closePopupBtn.addEventListener(`click`, onPopupCloseClick);

  // Рендер карточки фильма
  render(movieListElement, movieCard.getElement());
};

/**
 * Рендер списка фильмов
 * @param {MovieList} movieList
 * @param {[]} movies
 */
const renderMovieList = (movieList, movies) => {
  movies.forEach((movie) => renderMovieCard(movieList.getElement().querySelector(`.films-list__container`), movie));
};

/**
 * Рендер доски со списками фильмов
 * @param {MovieBoard} movieBoard
 * @param {[]} movies
 */
const renderMovieBoard = (movieBoard, movies) => {
  /**
   * Обработчик события клика по кнопке "Show More"
   */
  const onShowMoreBtnClick = () => {
    const previouslyShown = shownMovies;
    shownMovies = shownMovies + MOVIE_COUNT.ON_BTN;

    renderMovieList(mainMovieList, movies.slice(previouslyShown, shownMovies));

    if (shownMovies >= MOVIE_COUNT.TOTAL) {
      showMoreBtn.getElement().remove();
      showMoreBtn.removeElement();
    }
  };

  // Рендер доски со списками фильмов
  render(mainElement, movieBoard.getElement());

  /**
   * Элемент доски со списками фильмов
   * @type {Element}
   */
  const movieBoardElement = mainElement.querySelector(`.films`);

  /**
   * Главный список фильмов
   * @type {MovieList}
   */
  const mainMovieList = new MovieList(`All movies. Upcoming`);

  /**
   * Список фильмов с самым высоким рейтингом
   * @type {MovieList}
   */
  const topRatedList = new MovieList(`Top rated`, true);

  /**
   * Список самых обсуждаемых фильмов
   * @type {MovieList}
   */
  const mostCommentedList = new MovieList(`Most commented`, true);

  /**
   * Количество отображенных карточек на данный момент
   * @type {number}
   */
  let shownMovies = MOVIE_COUNT.ON_START;

  // Рендер основного списка фильмов и карточек в него
  render(movieBoardElement, mainMovieList.getElement());
  renderMovieList(mainMovieList, movies.slice(0, shownMovies));

  /**
   * Кнопка "Show More"
   * @type {ShowMoreButton}
   */
  const showMoreBtn = new ShowMoreButton();

  render(mainMovieList.getElement(), showMoreBtn.getElement());

  showMoreBtn.getElement().addEventListener(`click`, onShowMoreBtnClick);

  // Рендер самых высокооцененных фильмов
  render(movieBoardElement, topRatedList.getElement());
  renderMovieList(topRatedList, getTopRatedMovies(movies));

  // Рендер самых обсуждаемых фильмов
  render(movieBoardElement, mostCommentedList.getElement());
  renderMovieList(mostCommentedList, getMostCommentedMovies(movies));
};

// Рендер аватара и звания пользователя в шапке
render(headerElement, userProfile.getElement());

// Рендер меню фильтров и сортировки
render(mainElement, new Filter(generateFilters(generatedMovies)).getElement());
render(mainElement, new Sort().getElement());

/**
 * Доска со списками фильмов
 * @type {MovieBoard}
 */
const movieBoard = new MovieBoard();
renderMovieBoard(movieBoard, generatedMovies);

// Рендер статистики в подвале
render(footerStatisticsElement, new Statistics(generatedMovies.length).getElement());
