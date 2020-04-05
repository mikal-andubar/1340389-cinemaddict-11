/**
 * Отрисовка дополнительного список фильмов: "Top Rated" или "Most Comment"
 * @param {string} title заголовок дополнительного списка
 * @return {string}
 */
export const createMovieListExtraTemplate = (title) => (
  `<section class="films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>`
);
