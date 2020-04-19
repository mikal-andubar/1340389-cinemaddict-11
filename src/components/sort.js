import AbstractComponent from "./abstract-component";

/**
 * Отрисовка списка фильтров
 * @return {string}
 */
const createSortingTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

/**
 * Класс для элементов сортировки
 */
export default class Sort extends AbstractComponent {
  /**
   * Возвращает шаблон элементов сортировки
   * @return {string}
   */
  getTemplate() {
    return createSortingTemplate();
  }
}
