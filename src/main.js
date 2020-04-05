import {createMovieCardTemplate} from "./components/movie-card";
import {createUserProfileTemplate} from "./components/profile";
import {createNavigationTemplate} from "./components/navigation";
import {createFiltersTemplate} from "./components/filters";
import {createMovieListTemplate} from "./components/movie-list";
import {createLoadMoreBtnTemplate} from "./components/load-more-btn";
import {createMovieListExtraTemplate} from "./components/movie-list-extra";
import {createMoviePopupTemplate} from "./components/movie-popup";
import {createStatisticsTemplate} from "./components/statistics";

const MOVIE_COUNT = 5;
const MOVIE_EXTRA_COUNT = 2;

/**
 * Вся шапка сайта
 * @type {Element}
 */
const headerElement = document.querySelector(`.header`);

/**
 * Основной блок страницы
 * @type {Element}
 */
const mainlement = document.querySelector(`.main`);

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
 * Функция рендера
 * @param {Element} container
 * @param {string} template
 * @param {string} place
 */
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

/**
 * Рендер нескольких карточек фильмов
 * @param {Element} container
 * @param {number} count
 */
const renderMovieList = (container, count) => {
  for (let i = 0; i < count; i++) {
    render(container, createMovieCardTemplate());
  }
};

// Рендер аватара и звания пользователя в шапке
render(headerElement, createUserProfileTemplate());

// Рендер меню сайтов и фильтров
render(mainlement, createNavigationTemplate());
render(mainlement, createFiltersTemplate());

// Рендер контейнера для списков фильмов
render(mainlement, createMovieListTemplate());

/**
 * Общий контейнер для списков фильмов. Оъявляем здесь, так как соответствующий элемент только что отрисовался
 * @type {Element}
 */
const movieListContainer = mainlement.querySelector(`.films`);

/**
 * Сюда будем вставлять карточки фильмов. Основной список.
 * @type {Element | any}
 */
const movieListElement = movieListContainer.querySelector(`.films-list__container`);

// Рендер карточек фильмов
renderMovieList(movieListElement, MOVIE_COUNT);

// Реднер кнопки "Load more"
render(movieListElement, createLoadMoreBtnTemplate(), `afterend`);

// Рендер контейнеров для дополнительных списков фильмов
render(movieListContainer, createMovieListExtraTemplate(`Top rated`));
render(movieListContainer, createMovieListExtraTemplate(`Most commented`));

/**
 * Все (2 штуки) дополнительные списки фильмов
 * @type {NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element> | NodeListOf<SVGElementTagNameMap[string]>}
 */
const movieExtraLists = movieListContainer.querySelectorAll(`.films-list--extra .films-list__container`);

// Наполнение дополнительных списков карточками фильмов
for (let extraList of movieExtraLists) {
  renderMovieList(extraList, MOVIE_EXTRA_COUNT);
}

// Рендер попапа
render(footerElement, createMoviePopupTemplate(), `afterend`);

// Рендер статистики в подвале
render(footerStatisticsElement, createStatisticsTemplate());

