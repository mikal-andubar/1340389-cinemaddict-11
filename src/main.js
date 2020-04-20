import Filter from "./components/filter";
import Sort from "./components/sort";
import UserProfile from "./components/user-profile";

import PageController from "./controllers/page";

import {generateFilters} from "./mock/filters";
import {generateMovies} from "./mock/movie";
import {generateUser} from "./mock/user";
import {render} from "./utils/render";

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
render(headerElement, userProfile);

// Рендер меню фильтров и сортировки
render(mainElement, new Filter(generateFilters(movies)));
render(mainElement, new Sort());

const pageController = new PageController(mainElement);
pageController.render(movies);
