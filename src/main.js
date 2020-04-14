import {createUserProfileTemplate} from "./components/profile";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {
  createMovieList,
  createMovieListContainer,
  createMovieListTemplate, getMostCommentedMovies,
  getTopRatedMovies,
} from "./components/movie-list";
import {createMoviePopupTemplate} from "./components/movie-popup";
import {createStatisticsTemplate} from "./components/statistics";
import {MOVIE_COUNT, RENDER_PLACE} from "./constatnts";
import {generateMovies} from "./mock/movie";
import {generateFilters} from "./mock/filters";
import {generateUser} from "./mock/user";

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
const movies = generateMovies(MOVIE_COUNT.TOTAL);

/**
 * Фильмы с самым высоким рейтингом
 * @type {{}[]}
 */
const topRatedMovies = getTopRatedMovies(movies);

/**
 * Фильмы с самым большим количеством комментариев
 * @type {{}[]}
 */
const mostCommentedMovies = getMostCommentedMovies(movies);

/**
 * Количество отображенных карточек на данный момент
 * @type {number}
 */
let shownMovies = MOVIE_COUNT.ON_START;

/**
 * Профиль пользователя
 * @type {}
 */
const user = generateUser(movies);

/**
 * Функция рендера
 * @param {Element} container
 * @param {string} template
 * @param {string} place
 */
const render = (container, template, place = RENDER_PLACE.BEFORE_END) => {
  container.insertAdjacentHTML(place, template);
};

// Рендер аватара и звания пользователя в шапке
render(headerElement, createUserProfileTemplate(user));

// Рендер меню фильтров и сортировки
render(mainElement, createFiltersTemplate(generateFilters(movies)));
render(mainElement, createSortingTemplate());

// Рендер контейнера для списков фильмов
render(mainElement, createMovieListContainer());

/**
 * Общий контейнер для списков фильмов. Оъявляем здесь, так как соответствующий элемент только что отрисовался
 * @type {Element}
 */
const movieListContainer = mainElement.querySelector(`.films`);

// Рендер основного списка фильмов
render(movieListContainer, createMovieListTemplate(`All movies. Upcoming`));

/**
 * Основной список фильмов
 * @type {Element | any}
 */
const mainMovieList = movieListContainer.querySelector(`.films-list__container`);

// Рендер части фильмов в основной список
render(mainMovieList, createMovieList(movies.slice(0, MOVIE_COUNT.ON_START)));

/**
 * Кнопка "Load More"
 * @type {Element}
 */
const loadMoreBtn = movieListContainer.querySelector(`.films-list__show-more`);

// Рендер контейнеров для дополнительных списков
render(movieListContainer, createMovieListTemplate(`Top rated`, true));
render(movieListContainer, createMovieListTemplate(`Most commented`, true));

/**
 * Все (2 штуки) дополнительные списки фильмов
 * @type {NodeListOf<Element>}
 */
const movieExtraLists = movieListContainer.querySelectorAll(`.films-list--extra .films-list__container`);

// Наполнение дополнительных списков карточками фильмов
render(movieExtraLists[0], createMovieList(topRatedMovies));
render(movieExtraLists[1], createMovieList(mostCommentedMovies));

// Рендер попапа
render(footerElement, createMoviePopupTemplate(movies[0]), RENDER_PLACE.AFTER_END);

/**
 * Попап с детальной информацией о фильме
 * @type {Element}
 */
const moviePopupElement = document.querySelector(`.film-details`);

/**
 * Кнопка закрытия попапа
 * @type {Element}
 */
const closePopupBtn = moviePopupElement.querySelector(`.film-details__close-btn`);

// Обработчик события по клику на кнопку закрытия попапа
closePopupBtn.addEventListener(`click`, () => {
  moviePopupElement.classList.add(`visually-hidden`);
});

// Рендер статистики в подвале
render(footerStatisticsElement, createStatisticsTemplate(movies.length));

// Обработчик нажания на кнопу "Load More"
loadMoreBtn.addEventListener(`click`, () => {
  const previouslyShown = shownMovies;
  shownMovies = shownMovies + MOVIE_COUNT.ON_BTN;

  render(mainMovieList, createMovieList(movies.slice(previouslyShown, shownMovies)));

  if (shownMovies >= MOVIE_COUNT.TOTAL) {
    loadMoreBtn.remove();
  }
});
