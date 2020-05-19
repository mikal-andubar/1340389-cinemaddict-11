import {
  generatePerson, getPersonsList,
  getRandomArrayItem,
  getRandomBool,
  generateRandomDate,
  getRandomDecimal,
  getRandomInt,
  generateRandomText,
} from "../utils/common";
import {generateComments} from "./comment";

/**
 * Массив жанров
 * @type {string[]}
 */
const genres = [`Musical`, `Western`, `Drama`, `Mystery`, `Cartoon`, `Action`, `Thriller`];

const countries = [`Russia`, `USA`, `India`, `France`, `Italy`, `Canada`];
/**
 * Массив путей к картикам с постерами
 * @type {string[]}
 */
const posters = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`,
];

/**
 * Вараинты ограничений по возрасту
 * @type {number[]}
 */
const ageVariants = [0, 6, 12, 16, 18, 21];

/**
 * Генератор заголовка
 * @return {string}
 */
const generateTitle = () => {
  const titleFirstWords = [`Great`, `Spider`, `Starship`, `Star`, `Time`, `Little`, `Universal`, `Lost`];
  const titleSecondWords = [`Gatsby`, `Man`, `Troopers`, `Wars`, `Machine`, `China`, `Soldier`, `Ark`];

  return `${getRandomArrayItem(titleFirstWords)} ${getRandomArrayItem(titleSecondWords)}${(getRandomBool() ? ` ${getRandomInt(2, 6)}` : ``)}`;
};

/**
 * Возвращает массив жанров
 * @param {number} count
 * @return {[]}
 */
const getGenresList = (count) => {
  let movieGenres = [];
  for (let i = 0; i < count; i++) {
    const newGenre = getRandomArrayItem(genres);
    if (!movieGenres.includes(newGenre)) {
      movieGenres.push(getRandomArrayItem(genres));
    }
  }
  return movieGenres;
};

/**
 * Генерирует объект фильма
 * @param {{}} movie
 * @param {number} index
 * @return {{}}
 */
const generateMovie = (movie, index) => {
  const title = generateTitle();
  const originalTitle = title;

  const isWatched = getRandomBool();
  const releaseDate = generateRandomDate(1930, 2020);

  return {
    id: index,
    title,
    originalTitle,
    director: generatePerson(),
    writers: getPersonsList(getRandomInt(1, 3)),
    actors: getPersonsList(getRandomInt(3, 5)),
    country: getRandomArrayItem(countries),
    rating: getRandomDecimal(5, 10),
    releaseDate,
    duration: getRandomInt(60, 180),
    genres: getGenresList(getRandomInt(2, 5)),
    poster: getRandomArrayItem(posters),
    description: generateRandomText(1, 5),
    age: getRandomArrayItem(ageVariants),
    isWatched,
    isInWatchlist: isWatched ? false : getRandomBool(),
    isFavorite: isWatched ? getRandomBool() : false,
    watchingDate: isWatched ? generateRandomDate(releaseDate.getFullYear(), 2020) : null,
    comments: generateComments(getRandomInt(0, 6)),
  };
};

/**
 * Генератор фильмов
 * @param {number} movieCount
 * @return {{country: *, comments: *[], releaseDate: Date, director: {}, rating: string, description: string, isWatched: boolean, writers: *[], title: string, duration: number, actors: *[], originalTitle: string, genres: *[], isInWatchlist: (boolean|boolean), poster: *, age: *, isFavorite: (boolean|boolean)}[]}
 */
export const generateMovies = (movieCount) => new Array(movieCount).fill(``).map(generateMovie);
