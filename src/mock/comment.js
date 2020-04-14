import {generatePerson, generateRandomDate, generateRandomText, getRandomArrayItem} from "../utils";
import {emojiSet} from "../components/comments";

/**
 * Генерирует комметарий
 * @return {{}}
 */
const generateComment = () => ({
  emoji: getRandomArrayItem(emojiSet),
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
