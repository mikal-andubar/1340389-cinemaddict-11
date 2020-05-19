import FilterComponent from "../components/filter";

import {componentRender} from "../utils/render";

/**
 * Контроллер для фильтров
 */
export default class FilterController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {{}} moviesModel
   */
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._filter = new FilterComponent();

    this._onFilterChange = this._onFilterChange.bind(this);
    this._filter.setFilterChangeHandler(this._onFilterChange);

    componentRender(this._container, this._filter);
  }

  /**
   * Обновление списка фильтров
   */
  refresh() {
    this._filter.setMovies(this._moviesModel.getAllMovies());
    this._filter.rerender();
  }

  /**
   * Пробрасывает обработчик в компонент
   * @param {function} handler
   */
  setStatisticsViewHandler(handler) {
    this._filter.setStatisticsViewHandler(handler);
  }

  /**
   * Обработчик смены фильтра
   * @param {{}} filter
   * @private
   */
  _onFilterChange(filter) {
    this._moviesModel.setCurrentFilter(filter);
  }

}
