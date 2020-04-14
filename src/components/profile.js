/**
 * Отрисовка звания пользователя и аватара
 * @param {{}} user
 * @return {string}
 */
export const createUserProfileTemplate = ({rating, avatar}) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
  </section>`
);
