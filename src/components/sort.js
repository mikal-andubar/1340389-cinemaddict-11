import AbstractComponent from "./abstract-component";

/**
 * Виды сортировки
 * @type {{}}
 */
export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
  COMMENTS: `comments`
};

/**
 * Вспомогательная функция сортировки массива фильмов
 * @param {{}[]}movies
 * @param {string} sortType
 * @return {{}[]}
 */
export const getSortedMoviesBySortType = (movies, sortType) => {
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DATE:
      return showingMovies.sort((a, b) => b.releaseDate - a.releaseDate);
    case SortType.RATING:
      return showingMovies.sort((a, b) => b.rating - a.rating);
    case SortType.COMMENTS:
      return showingMovies.sort((a, b) => b.comments.length - a.comments.length);
    default:
      return showingMovies;
  }
};

/**
 * Класс активной кнопки сортировки
 * @type {string}
 */
const SORT_ACTIVE_CLASS = `sort__button--active`;

/**
 * Создает разметку кнопки сортировки
 * @param {string} sortType
 * @param {number} index
 * @return {string}
 */
const createSortBtn = (sortType, index) => {
  if (sortType === SortType.COMMENTS) {
    return ``;
  }
  return (
    `<li>
      <a
        href="#"
        class="sort__button ${index ? `` : SORT_ACTIVE_CLASS}"
        data-sort-type="${sortType}"
      >
        Sort by ${sortType}
      </a>
    </li>`
  );
};

/**
 * Отрисовка списка фильтров
 * @return {string}
 */
const createSortingTemplate = () => {
  const sortLines = Object.values(SortType).map(createSortBtn).join(`\n`);

  return (`<ul class="sort">${sortLines}</ul>`);
};

/**
 * Снимает класс "sort__button--active" со всех кнопок сортировки
 * @param {Element} sortListElement
 */
const deactivateSortBtns = (sortListElement) => {
  const sortBtns = sortListElement.querySelectorAll(`.sort__button`);
  sortBtns.forEach((btn) => {
    btn.classList.remove(SORT_ACTIVE_CLASS);
  });
};

/**
 * Класс для элементов сортировки
 */
export default class Sort extends AbstractComponent {

  /**
   * Конструктор для класса сортировки
   */
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  /**
   * Возвращает шаблон элементов сортировки
   * @return {string}
   */
  getTemplate() {
    return createSortingTemplate();
  }

  /**
   * Возвращает массив фильмов в заданном интервале с учетом текущего вида сортировки
   * @param {{}[]} movies
   * @param {number} from
   * @param {number} to
   * @return {{}[]}
   */
  getSortedMovies(movies, from, to) {
    const sortedMovies = getSortedMoviesBySortType(movies, this._currentSortType);
    return sortedMovies.slice(from, to);
  }

  /**
   * Установка обработчика для смены вида сортировки
   * @param {function} handler
   */
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (event) => {
      event.preventDefault();

      const sortBtn = event.target;
      const sortType = sortBtn.dataset.sortType;

      if (!sortType || this._currentSortType === sortType) {
        return;
      }

      deactivateSortBtns(this.getElement());
      sortBtn.classList.add(SORT_ACTIVE_CLASS);

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
