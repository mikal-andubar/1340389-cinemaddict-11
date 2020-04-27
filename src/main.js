import UserProfile from "./components/user-profile";

import PageController from "./controllers/page";

import {generateMovies} from "./mock/movie";
import {generateUser} from "./mock/user";
import {componentRender} from "./utils/render";

import {MOVIE_COUNT} from "./constants";
import Statistics from "./components/statistics";

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
 * Массив объектов с фильмами
 * @type {{}[]}
 */
const movies = generateMovies(MOVIE_COUNT.TOTAL);

/**
 * Профиль пользователя
 * @type {UserProfile}
 */
const userProfile = new UserProfile(generateUser(movies));

// Рендер аватара и звания пользователя в шапке
componentRender(headerElement, userProfile);

/**
 * Контроллер основного блока страницы
 * @type {PageController}
 */
const pageController = new PageController(mainElement);
// Рендер основного блока страницы
pageController.render(movies);

/**
 * Раздел для отображения статистики
 * @type {Element}
 */
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
// Рендер статистики в подвале
componentRender(footerStatisticsElement, new Statistics(movies.length));
