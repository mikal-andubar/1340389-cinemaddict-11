import UserProfile from "./components/user-profile";

import PageController from "./controllers/page";

import {generateMovies} from "./mock/movie";
import {generateUser} from "./mock/user";
import {componentRender} from "./utils/render";

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
