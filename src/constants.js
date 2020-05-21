/**
 * Место для рендера
 * @type {{}}
 */
export const RENDER_PLACE = {
  BEFORE_END: `beforeend`,
  BEFORE_BEGIN: `beforebegin`,
  AFTER_END: `afterend`,
  AFTER_BEGIN: `afterbegin`,
};

/**
 * Константы управляющие отображением
 * @type {{}}
 */
export const MOVIE_COUNT = {
  TOTAL: 23,
  ON_START: 5,
  ON_BTN: 5,
  EXTRA: 2
};

/**
 * Коды клавиш клавиатуры для обработчиков событий
 * @type {{}}
 */
export const KEY_CODE = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
  ENTER: `Enter`,
};

/**
 * Виды сортировки
 * @type {{}}
 */
export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
  COMMENTS: `comments`
};

/**
 * Названия для кнопок на карточке фильма
 * @type {{}}
 */
export const MOVIE_BUTTON = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`,
};

export const EmojiNames = {
  SMILE: `smile`,
  ANGRY: `angry`,
  SLEEPING: `sleeping`,
  PUKE: `puke`
};

/**
 * Смайлики
 * @type {{}}
 */
export const Emojis = {
  [EmojiNames.SMILE]: `./images/emoji/smile.png`,
  [EmojiNames.ANGRY]: `./images/emoji/angry.png`,
  [EmojiNames.SLEEPING]: `./images/emoji/sleeping.png`,
  [EmojiNames.PUKE]: `./images/emoji/puke.png`,
};

/**
 * Режимы отображения карточки с фильмом: обычный и попап
 * @type {{POPUP: string, DEFAULT: string}}
 */
export const MovieCardModes = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export const DATE_FORMAT = {
  CARD: `YYYY`,
  POPUP: `DD MMMM YYYY`,
  COMMENT: `fromnow`
};

/**
 * Типы списка фильмов: основной, дополнительный, пустой
 * @type {{}}
 */
export const MovieListType = {
  EMPTY: `empty`,
  MAIN: `main`,
  EXTRA: `extra`,
};

export const MOVIE_LIST_KEY = {
  MAIN: `main`,
  TOP_RATED: `top_rated`,
  MOST_COMMENTED: `most_commented`,
  EMPTY: `empty`,
  LOADING: `loading`,
};
