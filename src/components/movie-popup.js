import {MONTH_NAMES} from "../constatnts";
import {formatDuration} from "../utils";
import {createCommentsTemplate} from "./comments";

/**
 * Создание шаблона списка жанров
 * @param {[]} genres
 * @return {string}
 */
const createGenresListTemplate = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`);

/**
 * Создание шаблона с разметкой для попапа
 * @param {{}} movie
 * @return {string}
 */
export const createMoviePopupTemplate = (movie) => {
  const {
    title,
    originalTitle,
    director,
    writers,
    actors,
    country,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    description,
    age,
    comments,
    isInWatchList,
    isWatched,
    isFavorite
  } = movie;

  const dateString = `${releaseDate.getDate()} ${MONTH_NAMES[releaseDate.getMonth()]} ${releaseDate.getFullYear()}`;
  const writersList = writers.map((person) => `${person.firstName} ${person.secondName}`).join(`, `).trim();
  const actorsList = actors.map((person) => `${person.firstName} ${person.secondName}`).join(`, `).trim();

  const watchlistChecked = isInWatchList ? `checked` : ``;
  const watchedChecked = isWatched ? `checked` : ``;
  const favoriteChecked = isFavorite ? `checked` : ``;

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${age}+}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director.firstName} ${director.secondName}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dateString}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formatDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${createGenresListTemplate(genres)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistChecked}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedChecked}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteChecked}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          ${createCommentsTemplate(comments)}
        </section>
      </div>
    </form>
  </section>`
  );
};
