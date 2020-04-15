/**
 * Испточник предложений для случайного текста
 * @type {string}
 */
import {RENDER_PLACE} from "./constatnts";

const textSource = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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
 * Форматирует длительность фильма для отображения
 * @param {number} duration
 * @return {string}
 */
export const formatDuration = (duration) => `${Math.floor(duration / 60)}h ${duration % 60}m`;

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
export const generatePerson = () => {
  const firstNames = [`James`, `John`, `Ben`, `Leonardo`, `Jennifer`, `Cortney`, `Cillian`, `Tom`];
  const secondNames = [`Cameron`, `Carpenter`, `Affleck`, `DiCaprio`, `Aniston`, `Cox`, `Murphy`, `Hardy`];

  return {
    firstName: getRandomArrayItem(firstNames),
    secondName: getRandomArrayItem(secondNames),
  };
};

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
 * Добавление ведущего нуля
 * @param {number} value
 * @return {string}
 */
const castDateTimeFormat = (value) => value < 10 ? `0${value}` : String(value);

/**
 * Форматирование времени
 * @param {Date} date
 * @return {string}
 */
export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = castDateTimeFormat(date.getMonth() + 1);
  const day = castDateTimeFormat(date.getDate());
  const hours = castDateTimeFormat(date.getHours());
  const minutes = castDateTimeFormat(date.getMinutes());

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};


/**
 * Создает и возвращает элемент DOM с переданным содержимым
 * @param {string} template
 * @return {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Функция рендера элемента
 * @param {Element} container
 * @param {Element} element
 * @param {string} place
 */
export const render = (container, element, place = RENDER_PLACE.BEFORE_END) => {
  switch (place) {
    case RENDER_PLACE.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RENDER_PLACE.BEFORE_END:
      container.append(element);
      break;
  }
};
