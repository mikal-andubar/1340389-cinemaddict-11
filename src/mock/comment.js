import {
  generatePerson,
  generateRandomDate,
  generateRandomText,
  getRandomArrayItem,
  getRandomInt,
} from "../utils/common";
import {Emojis} from "../constants";

/**
 * Генерирует комментарий
 * @return {{}}
 */
const generateComment = () => ({
  id: Date.now().toString() + getRandomInt(1, 1000).toString(),
  emoji: getRandomArrayItem(Object.entries(Emojis)),
  text: generateRandomText(1, 1),
  author: generatePerson(),
  date: generateRandomDate(2017, 2020),
});

/**
 * Генерирует массив комментариев
 * @param {number} commentCount
 * @return {[]}
 */
export const generateComments = (commentCount) => new Array(commentCount).fill(``).map(generateComment);


/**
 * Переводит комментарии в отдельный массив
 * @param {{}[]} movies
 * @return {{}[]}
 */
export const extractComments = (movies) => {
  let comments = [];
  movies.forEach((movie) => {
    comments = [].concat(comments, movie.comments);
    movie.comments = movie.comments.map((comment) => comment.id);
  });
  return comments;
};
