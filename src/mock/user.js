import {increaseInt} from "../utils";

/**
 * Возвращает строку с рейтингом по переданному количеству
 * @param {number} count
 * @return {string}
 */
const getRating = (count) => {
  let rating;
  switch (true) {
    case (count >= 21):
      rating = `Movie Buff`;
      break;
    case (count >= 11):
      rating = `Fan`;
      break;
    case (count >= 1):
      rating = `Novice`;
      break;
    default:
      rating = ``;
      break;
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
