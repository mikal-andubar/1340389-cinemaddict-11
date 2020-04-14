import {increaseInt} from "../utils";

/**
 * Вычисляет рейтинг пользователя
 * @param {[]} movies
 * @return {string|string}
 */
const calculateUserRating = (movies) => {
  const ratingCalc = movies.reduce((ratingAcc, movie) => {
    const count = movie.isWatched ? increaseInt(ratingAcc.count) : ratingAcc.count;

    let rating = ratingAcc.rating;

    if (count >= 1) {
      rating = `Novice`;
    }
    if (count >= 11) {
      rating = `Fan`;
    }
    if (count >= 21) {
      rating = `Movie Buff`;
    }

    return {
      rating,
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
