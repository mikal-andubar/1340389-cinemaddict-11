import moment from "moment";

import {DATE_FORMAT, SortType} from "../constants";

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
 * Возвращает случайный элемент массива
 * @param {[]} array
 * @return {*}
 */
export const getRandomArrayItem = (array) => array[getRandomInt(0, array.length)];

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
 * @param {Movie[]}movies
 * @param {string} sortType
 * @return {Movie[]}
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
 * Удаляет элемент из массива по индексу и возвращает новый массив
 * @param {[]} array
 * @param {number} index
 * @return {[]}
 */
export const deleteFromArray = (array, index) => [].concat(array.slice(0, index), array.slice(index + 1));

/**
 * Ищет объект в массиве, который либо совпадает с переданным id, либо имеет свойство id, равное ему
 * @param {[]} array
 * @param {number} id
 * @return {number|*}
 */
export const findObjectIndexInArrayById = (array, id) => array.findIndex((it) => (it.id ? it.id : it) === id);
