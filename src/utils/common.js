import moment from "moment";

import {DATE_FORMAT, SortType} from "../constants";

/**
 * Источник предложений для случайного текста
 * @type {string}
 */
const textSource = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

/**
 * Массив имен для генерации человека
 * @type {string[]}
 */
const firstNames = [`James`, `John`, `Ben`, `Leonardo`, `Jennifer`, `Cortney`, `Cillian`, `Tom`];

/**
 * Массив фамилий для генерации человека
 * @type {string[]}
 */
const lastNames = [`Cameron`, `Carpenter`, `Affleck`, `DiCaprio`, `Aniston`, `Cox`, `Murphy`, `Hardy`];

/**
 * Прибавляет к числу numeric заданное addingValue
 * @param {number} numeric
 * @param {number} addingValue
 * @return {number}
 */
export const increaseInt = (numeric, addingValue = 1) => numeric + addingValue;

/**
 * Возвращает псевдослучайное целое число из интервала min-max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const getRandomInt = (min, max) => min + Math.floor(Math.random() * (max - min));

/**
 * Возвращает псевдослучайное целое число из интервала min-max
 * @param {number} min
 * @param {number} max
 * @param {number} precision
 * @return {string}
 */
export const getRandomDecimal = (min, max, precision = 1) => (min + Math.random() * (max - min)).toFixed(precision);

/**
 * Возвращает случайное значение boolean
 * @param {number} probability
 * @return {boolean}
 */
export const getRandomBool = (probability = 0.5) => Math.random() <= probability;

/**
 * Возвращает случайный элемент массива
 * @param {[]} array
 * @return {*}
 */
export const getRandomArrayItem = (array) => array[getRandomInt(0, array.length)];

/**
 * Возвращает случайную дату
 * @param {number} minYear
 * @param {number} maxYear
 * @param {boolean} withTime
 * @return {Date}
 */
export const generateRandomDate = (minYear, maxYear, withTime = false) => {
  const date = new Date();
  const year = getRandomInt(minYear, maxYear + 1);
  const month = getRandomInt(0, 12);
  const day = getRandomInt(1, 29);
  date.setFullYear(year, month, day);
  if (withTime) {
    date.setHours(getRandomInt(0, 24), getRandomInt(0, 60));
  }
  return date;
};

/**
 * Возвращает случайный текст с количеством предложений между заданного
 * @param {number} minSentencesQty
 * @param {number} maxSentencesQty
 * @return {string}
 */
export const generateRandomText = (minSentencesQty, maxSentencesQty) => {
  const sentencesQty = getRandomInt(minSentencesQty, maxSentencesQty + 1);
  const sentences = textSource.split(`.`).map((it) => it.trim());
  sentences.pop();

  let text = ``;
  for (let i = 0; i < sentencesQty; i++) {
    text = `${text} ${getRandomArrayItem(sentences)}. `;
  }

  return text.trim();
};

/**
 * Обрезка строки до заданного лимита
 * @param {string} text
 * @param {number} limit
 * @return {string}
 */
export const clipText = (text, limit) => text.length > limit ? `${text.slice(0, limit)}...` : text;


/**
 * Генератор человека
 * @return {{}}
 */
export const generatePerson = () => (
  {
    firstName: getRandomArrayItem(firstNames),
    lastName: getRandomArrayItem(lastNames),
  }
);

/**
 * Возвращает массив персон
 * @param {number} count
 * @return {[]}
 */
export const getPersonsList = (count) => {
  let generatedPersons = [];
  for (let i = 0; i < count; i++) {
    generatedPersons.push(generatePerson());
  }
  return generatedPersons;
};

/**
 * Форматирует длительность фильма для отображения
 * @param {number} minutes
 * @return {string}
 */
export const formatDuration = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  return `${duration.hours()}h ${duration.minutes()}m`;
};

/**
 * Форматирует длительность для страницы со статистикой
 * @param {number} minutes
 * @return {string}
 */
export const formatStatsDuration = (minutes) => {
  const duration = moment.duration(minutes, `minutes`);
  const totalHours = Math.floor(duration.asHours());
  return `${totalHours} <span class="statistic__item-description">h</span> ${duration.minutes()} <span class="statistic__item-description">m</span>`;
};

/**
 * Форматирует дату релиза
 * @param {Date} releaseDate
 * @param {string} format
 * @return {string}
 */
export const formatDate = (releaseDate, format = DATE_FORMAT.CARD) => {
  const date = moment(releaseDate);
  if (format === DATE_FORMAT.COMMENT) {
    return date.fromNow();
  }
  return date.format(format);
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
