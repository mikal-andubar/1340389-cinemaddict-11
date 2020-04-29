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
 * Названия месяцев
 * @type {string[]}
 */
export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

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
  ESC: `Esc`
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

/**
 * Конфигурация для кнопок на карточке фильма
 * @type {{}}
 */
export const MovieCardButton = {
  [MOVIE_BUTTON.WATCHLIST]: {
    name: `add-to-watchlist`,
    value: `Add to watchlist`,
    property: `isInWatchlist`,
  },
  [MOVIE_BUTTON.WATCHED]: {
    name: `mark-as-watched`,
    value: `Mark as watched`,
    property: `isWatched`,
  },
  [MOVIE_BUTTON.FAVORITE]: {
    name: `favorite`,
    value: `Mark as favorite`,
    property: `isFavorite`,
  },
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
