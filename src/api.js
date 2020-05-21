import Movie from "./models/movie";
import Comment from "./models/comment";

/**
 * Методы запросов
 * @type {{}}
 */
const Method = {
  GET: `GET`,
  PUT: `PUT`,
};

/**
 * Проверяет статус ответа сервера
 * @param {Response} response
 * @return {*}
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

/**
 * Класс API для связи с сервером
 * @type {API}
 */
const API = class {
  /**
   * Конструктор класса
   * @param {string} baseUrl
   * @param {string} auth
   */
  constructor(baseUrl, auth) {
    this._baseUrl = baseUrl;
    this._auth = auth;
  }

  /**
   * Получает фильмы с сервера
   * @return {Promise<Response>}
   */
  getMovies() {
    return this._request({url: `movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  /**
   * Обновляет данные на сервере
   * @param {number} movieId
   * @param {Movie} newData
   * @return {Promise<any>}
   */
  updateMovie(movieId, newData) {
    return this._request({
      url: `movies/${movieId}`,
      method: Method.PUT,
      body: JSON.stringify(newData.toServerStructure()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  /**
   * Получает все комментарии
   * @param {{}} movies
   * @return {Promise}
   */
  getComments(movies) {
    const headers = new Headers();
    headers.append(`Authorization`, this._auth);

    let comments = [];
    return Promise.all(movies.map((movie) => {
      return this._request({
        url: `comments/${movie.id}`,
      })
        .then((response) => response.json())
        .then((response) => {
          comments = [].concat(comments, Comment.parseComments(response));
        });
    })).then(() => comments);
  }

  /**
   * Выполняет запрос к серверу
   * @param {{}} params
   * @return {Promise<Response>}
   * @private
   */
  _request({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._baseUrl}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }

};

export default API;
