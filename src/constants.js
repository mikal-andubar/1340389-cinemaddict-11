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
 * Названия для кнопок на карточке фильма
 * @type {{}}
 */
export const MOVIE_BUTTON = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`,
};

/**
 * Используемые форматы даты
 * @type {{}}
 */
export const DATE_FORMAT = {
  CARD: `YYYY`,
  POPUP: `DD MMMM YYYY`,
  COMMENT: `fromnow`
};

/**
 * Время эффекта "покачивания головой" в миллисекундах
 * @type {number}
 */
export const SHAKE_TIME = 500;

/**
 * Коды клавиш клавиатуры для обработчиков событий
 * @type {{}}
 */
export const KeyCode = {
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

/**
 * Типы списка фильмов: основной, дополнительный, пустой
 * @type {{}}
 */
export const MovieListType = {
  EMPTY: `empty`,
  MAIN: `main`,
  EXTRA: `extra`,
};

/**
 * Списки фильмов
 * @type {{}}
 */
export const MovieListKey = {
  MAIN: `mainList`,
  TOP_RATED: `topRatedList`,
  MOST_COMMENTED: `mostCommentedList`,
  EMPTY: `emptyList`,
  LOADING: `loadingList`,
};

/**
 * Имена локальных хранилищ
 * @type {{}}
 */
export const StorageName = {
  MOVIES: `movies`,
  COMMENTS: `comments`,
};
