import UserProfile from "./components/user-profile";
import Statistics from "./components/statistics";
import Movies from "./models/movies";
import Comments from "./models/comments";

import PageController from "./controllers/page";

import {generateMovies} from "./mock/movie";
import {generateUser} from "./mock/user";
import {componentRender} from "./utils/render";
import {extractComments} from "./mock/comment";

import {MOVIE_COUNT} from "./constants";
import FilterController from "./controllers/filter";

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
 * Массив с комментариями
 * @type {{}[]}
 */
const comments = extractComments(movies);

/**
 * Модель данных для списка фильмов
 * @type {Movies}
 */
const moviesModel = new Movies();
moviesModel.setMovies(movies);

/**
 * Модель данных для комментариев
 * @type {Comments}
 */
const commentsModel = new Comments();
commentsModel.setComments(comments);

/**
 * Профиль пользователя
 * @type {UserProfile}
 */
const userProfile = new UserProfile(generateUser(movies));

// Рендер аватара и звания пользователя в шапке
componentRender(headerElement, userProfile);

const filterController = new FilterController(mainElement, moviesModel);
filterController.render();

/**
 * Контроллер основного блока страницы
 * @type {PageController}
 */
const pageController = new PageController(mainElement, moviesModel, commentsModel, filterController);
// Рендер основного блока страницы
pageController.render();

/**
 * Раздел для отображения статистики
 * @type {Element}
 */
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
// Рендер статистики в подвале
componentRender(footerStatisticsElement, new Statistics(movies.length));
