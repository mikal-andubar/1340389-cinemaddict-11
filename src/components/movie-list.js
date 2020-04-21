import AbstractComponent from "./abstract-component";

/**
 * Типы списка фильмов: основной, дополнительный, пустой
 * @type {{}}
 */
export const MovieListType = {
  EMPTY: `empty`,
  MAIN: `main`,
  EXTRA: `extra`,
};

/**
 * Создание списка фильмов
 * @param {string} title
 * @param {string} listType
 * @return {string}
 */
const createMovieListTemplate = (title, listType = MovieListType.MAIN) => {
  return (
    `<section class="films-list${listType === MovieListType.EXTRA ? `--${listType}` : ``}">
      <h2 class="films-list__title ${listType === MovieListType.MAIN ? `visually-hidden` : ``}">${title}</h2>
      ${listType === MovieListType.EMPTY ? `` : `<div class="films-list__container"></div>`}
    </section>`
  );
};

/**
 * Класс для списка фильмов
 */
export default class MovieList extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {string} title
   * @param {string} listType
   */
  constructor(title, listType = MovieListType.MAIN) {
    super();

    this._title = title;
    this._listType = listType;
  }

  /**
   * Возвращает шаблон списка фильмов
   * @return {string}
   */
  getTemplate() {
    return createMovieListTemplate(this._title, this._listType);
  }

  /**
   * Очищает содержимое списка фильмов
   */
  clearList() {
    const innerList = this.getElement().querySelector(`.films-list__container`);
    innerList.innerHTML = ``;
  }
}
