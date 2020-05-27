import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

import AbstractSmartComponent from "./abstract-smart-component";

import {getMoviesByFilter} from "../utils/filter";
import {FilterConfig} from "../config";
import {formatStatsDuration, increaseInt} from "../utils/common";

/**
 * Ширина столбца диаграммы статистики
 * @type {number}
 */
const BAR_HEIGHT = 50;

/**
 * Периоды для отображения статистика
 * @type {{}}
 */
const Period = {
  ALL_TIME: {
    name: `all-time`,
    label: `All time`,
    amount: 100,
    units: `year`,
  },
  TODAY: {
    name: `today`,
    label: `Today`,
    amount: 1,
    units: `day`,
  },
  WEEK: {
    name: `week`,
    label: `Week`,
    amount: 1,
    units: `week`,
  },
  MONTH: {
    name: `month`,
    label: `Month`,
    amount: 1,
    units: `month`,
  },
  YEAR: {
    name: `year`,
    label: `Year`,
    amount: 1,
    units: `year`,
  }
};

/**
 * Подсчитывает общую продолжительность просмотренных фильмов
 * @param {[]} movies
 * @return {number}
 */
const calculateWatchedMoviesDuration = (movies) => (
  movies.reduce((acc, movie) => {
    acc = increaseInt(acc, movie.duration);
    return acc;
  }, 0)
);

/**
 * Возвращает сводную статистику по жанрам
 * @param {[]} movies
 * @return {[]}
 */
const getGenresStatistics = (movies) => {
  const genres = movies.reduce((acc, movie) => {
    movie.genres.forEach((genre) => {
      acc[genre] = acc[genre] ? increaseInt(acc[genre] + 1) : 1;
    });
    return acc;
  }, {});
  return Object.entries(genres).sort((a, b) => b[1] - a[1]);
};

/**
 * Класс для статистики
 */
export default class Statistics extends AbstractSmartComponent {

  /**
   * Конструктор класса
   * @param {{}} userProfile
   * @param {{}} movieModel
   */
  constructor(userProfile, movieModel) {
    super();

    this._movieModel = movieModel;
    this._userProfile = userProfile;

    this._currentPeriod = Period.ALL_TIME;

    this._renderChart();
    this.recoveryListeners();
  }

  /**
   * Возвращает шаблон статистики
   * @return {string}
   */
  getTemplate() {
    return this._createStatisticsTemplate();
  }

  /**
   * Возвращает просмотренные фильмы за указанный период
   * @return {[]}
   * @private
   */
  _getWatchedMoviesForPeriod() {
    const {amount, units} = this._currentPeriod;
    const watchedMovies = getMoviesByFilter(this._movieModel.getAllMovies(), FilterConfig.HISTORY);
    const startDate = moment().subtract(amount, units);
    return watchedMovies.filter((movie) => {
      const watchingDate = moment(movie.watchingDate);
      return watchingDate.isAfter(startDate);
    });
  }

  /**
   * Возвращает самый популярный жанр для переданных фильмов
   * @param {[]} movies
   * @return {string}
   * @private
   */
  _getTopGenre(movies) {
    const genreStatistics = getGenresStatistics(movies);
    const topGenre = genreStatistics.slice(0, 1).pop();
    return topGenre ? topGenre.slice(0, 1).pop() : ``;
  }

  /**
   * Отрисовка статистики
   * @return {string}
   */
  _createStatisticsTemplate() {
    const {rating, avatar} = this._userProfile.getUser() ? this._userProfile.getUser() : {};

    const watchedMovies = this._getWatchedMoviesForPeriod();
    const totalDuration = calculateWatchedMoviesDuration(watchedMovies);
    const durationString = formatStatsDuration(totalDuration);
    const topGenre = this._getTopGenre(watchedMovies);

    const periodMenu = this._createPeriodsMenuMarkup();

    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${periodMenu}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${durationString}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
  }

  /**
   * Создает разметку для меню периодов для статистики
   * @return {string}
   */
  _createPeriodsMenuMarkup() {
    return Object.values(Period).map((period) => {
      const checked = period.name === this._currentPeriod.name ? `checked` : ``;
      return (
        `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period.name}" value="${period.name}" ${checked}>
        <label for="statistic-${period.name}" class="statistic__filters-label">${period.label}</label>`
      );
    }).join(`\n`);
  }

  /**
   * Отрисовка диаграммы со статистикой
   * @return {{}}
   * @private
   */
  _renderChart() {
    const genres = getGenresStatistics(this._getWatchedMoviesForPeriod());
    const labels = genres.map((genre) => genre.slice(0, 1).pop());
    const data = genres.map((genre) => genre.slice(1).pop());

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    statisticCtx.height = BAR_HEIGHT * genres.length;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  /**
   * @inheritDoc
   */
  show() {
    super.show();

    this.rerender();
    this._renderChart();
  }

  /**
   * @inheritDoc
   */
  recoveryListeners() {
    Object.values(Period).forEach((period) => {
      this.getElement()
        .querySelector(`#statistic-${period.name}`)
        .addEventListener(`change`, () => {
          this._currentPeriod = period;
          this.rerender();
          this._renderChart();
        });
    });
  }
}
