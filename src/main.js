import UserProfile from "./components/user-profile";
import FooterStatistics from "./components/footer-statistics";
import Movies from "./models/movies";
import Comments from "./models/comments";

import API from "./api";

import PageController from "./controllers/page";
import FilterController from "./controllers/filter";

import {componentRender} from "./utils/render";

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
 * API для работы с сервером
 * @type {API}
 */
const api = new API();

/**
 * Модель данных для списка фильмов
 * @type {Movies}
 */
const moviesModel = new Movies();

/**
 * Модель данных для комментариев
 * @type {Comments}
 */
const commentsModel = new Comments();

/**
 * Компонент, отображающий профиль пользователя
 * @type {UserProfile}
 */
const userProfile = new UserProfile(moviesModel);

/**
 * Контроллер фильтров
 * @type {FilterController}
 */
const filterController = new FilterController(mainElement, moviesModel);

/**
 * Контроллер основного блока страницы
 * @type {PageController}
 */
const pageController = new PageController(mainElement, userProfile, moviesModel, commentsModel, filterController, api);

/**
 * Раздел для отображения статистики
 * @type {Element}
 */
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

componentRender(headerElement, userProfile);

pageController.init();

/**
 * Функция для рендера полной страницы при успешной загрузке данных с сервера
 * @param {Movie[]} movies
 */
const renderFullPage = (movies) => {
  moviesModel.setMovies(movies);
  userProfile.refreshUser(movies);

  filterController.refresh();
  pageController.render();
  componentRender(footerStatisticsElement, new FooterStatistics(movies.length));

  api.getComments(movies).then((comments) => {
    commentsModel.setComments(comments);
  });
};

/**
 * Функция для рендера пустой страницы при ошибке загрузки
 */
const renderEmptyPage = () => {
  pageController.render();
  componentRender(footerStatisticsElement, new FooterStatistics(0));
};

api.getMovies()
  .then(renderFullPage)
  .catch(renderEmptyPage);

