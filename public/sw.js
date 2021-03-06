const PREFIX = `cinemaddict-cache`;
const VERSION = `v1`;
const CACHE_NAME = `${PREFIX}-${VERSION}`;

// Устанавливаем ServiceWorker
self.addEventListener(`install`, (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `./`,
          `./index.html`,
          `./bundle.js`,
          `./css/normalize.css`,
          `./css/main.css`,
          `./css/effects.css`,
          `./images/background.png`,
          `./images/bitmap.png`,
          `./images/bitmap@2x.png`,
          `./images/bitmap@3x.png`,
          `./images/emoji/angry.png`,
          `./images/emoji/puke.png`,
          `./images/emoji/sleeping.png`,
          `./images/emoji/smile.png`,
          `./images/icons/icon-favorite.svg`,
          `./images/icons/icon-favorite-active.svg`,
          `./images/icons/icon-watched.svg`,
          `./images/icons/icon-watched-active.svg`,
          `./images/icons/icon-watchlist.svg`,
          `./images/icons/icon-watchlist-active.svg`,
        ]);
      })
  );
});

/**
 * Чистка кэша прошлых версий
 * @param {[]} keys
 * @return {Promise[]}
 */
const clearOldCache = (keys) => Promise.all(
  keys.map(
    (key) => {
      if (key.startsWith(PREFIX) && key !== CACHE_NAME) {
        return caches.delete(key);
      }

      return null;
    })
    .filter((key) => key !== null)
);

// Активируем ServiceWorker
self.addEventListener(`activate`, (event) => {
  event.waitUntil(
    caches.keys()
      .then(clearOldCache)
  );
});

/**
 * Сохраняем ответ в кэш
 * @param response
 * @return {*}
 */
const putToCache = (response) => {
  if (!response || response.status !== 200 || response.type !== `basic`) {
    return response;
  }

  const clonedResponse = response.clone();

  caches.open(CACHE_NAME)
    .then((cache) => cache.put(request, clonedResponse));

  return response;
}

// Перехватываем fetch
self.addEventListener(`fetch`, (event) => {
  const {request} = event;
  event.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request)
          .then(putToCache);
      })
  );
});
