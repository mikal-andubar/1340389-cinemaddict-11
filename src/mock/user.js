import {increaseInt} from "../utils/common";

/**
 * Рейтинг пользователя в зависимости от количества просмотренных фильмов
 * @type {}
 */
const userRatings = {
  [`Novice`]: 1,
  [`Fan`]: 11,
  [`Movie Buff`]: 21,
};

/**
 * Возвращает строку с рейтингом по переданному количеству
 * @param {number} count
 * @return {string}
 */
const getRating = (count) => {
  let rating = ``;
  for (const key in userRatings) {
    if (count >= userRatings[key]) {
      rating = key;
    } else {
      break;
    }
  }
  return rating;
};

/**
 * Вычисляет рейтинг пользователя
 * @param {[]} movies
 * @return {string|string}
 */
const calculateUserRating = (movies) => {
  const ratingCalc = movies.reduce((ratingAcc, movie) => {
    const count = movie.isWatched ? increaseInt(ratingAcc.count) : ratingAcc.count;

    return {
      rating: getRating(count),
      count,
    };
  }, {rating: ``, count: 0});

  return ratingCalc.rating;
};

/**
 * Генерирует информацию о пользователе
 * @param {[]} movies
 * @return {{rating: string, avatar: string}}
 */
export const generateUser = (movies) => ({
  rating: calculateUserRating(movies),
  avatar: `images/bitmap@2x.png`
});
