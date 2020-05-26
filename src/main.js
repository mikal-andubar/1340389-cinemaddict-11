import UserProfile from "./components/user-profile";
import FooterStatistics from "./components/footer-statistics";
import Movies from "./models/movies";
import Comments from "./models/comments";

import API from "./api/api";
import Provider from "./api/provider";
import Store from "./api/store";

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
 * Экземпляр хранилища
 * @type {Store}
 */
const store = new Store();

/**
 * API через провайдер
 * @type {Provider}
 */
const apiWithProvider = new Provider(api, store);

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
const pageController = new PageController(mainElement, userProfile, moviesModel, commentsModel, filterController, apiWithProvider);

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

  apiWithProvider.getComments(movies)
    .then((comments) => {
      commentsModel.setComments(comments);
    });
};

/**
 * Функция для рендера пустой страницы при ошибке загрузки
 */
const renderEmptyPage = () => {
  pageController.renderEmpty();
  componentRender(footerStatisticsElement, new FooterStatistics(0));
};

apiWithProvider.getMovies()
  .then(renderFullPage)
  .catch(renderEmptyPage);

// Если пропал интернет, уведомим об этом пользователя сообщением в заголовке вкладки
const reportOffline = () => {
  document.title = `${document.title} [offline]`;
};

if (!navigator.onLine) {
  reportOffline();
}

window.addEventListener(`offline`, () => {
  reportOffline();
});

// При возвращении в онлайн убираем сообщение из заголовка вкладки
window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.isNeedToSync()) {
    apiWithProvider.sync()
      .catch(() => {
        throw new Error(`Ошибка при синхронизации с сервером!`);
      });
  }
});

// Регистрируем ServiceWorker
window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .catch(() => {
      throw new Error(`Не удалось зарегистрировать ServiceWorker!`);
    });
});
