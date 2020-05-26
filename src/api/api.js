import Movie from "../models/movie";
import Comment from "../models/comment";

/**
 * Методы запросов
 * @type {{}}
 */
const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const ResponseCode = {
  OK: 200,
  MULTI_CHOICES: 300,
};

/**
 * Класс API для связи с сервером
 * @type {API}
 */
const API = class {
  /**
   * Конструктор класса
   */
  constructor() {
    this._baseUrl = `https://11.ecmascript.pages.academy/cinemaddict`;
    this._auth = `Basic werkgjhwe352nkwfj=`;
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
   * @param {Movie} newData
   * @return {Promise<any>}
   */
  updateMovie(newData) {
    return this._request({
      url: `movies/${newData.id}`,
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
   * Добавляет комментарий на сервер
   * @param {number} movieId
   * @param {Comment} newData
   * @return {Promise<any>}
   */
  addComment(movieId, newData) {
    return this._request({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(newData.toServerStructure()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then((response) => {
        return response.comments;
      });
  }

  /**
   * Удаляет комментарий на сервере
   * @param {number} commentId
   * @return {Promise}
   */
  deleteComment(commentId) {
    return this._request({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  /**
   * Синхронизация данных с сервером
   * @param {{}} data
   * @return {Promise}
   */
  sync(data) {
    return this._request({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
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
      .then(this._checkStatus)
      .catch(() => {
        throw new Error(`Ошибка при обращении к серверу!`);
      });
  }

  /**
   * Проверяет статус ответа сервера
   * @param {Response} response
   * @return {*}
   * @private
   */
  _checkStatus(response) {
    if (response.status >= ResponseCode.OK && response.status < ResponseCode.MULTI_CHOICES) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  }

};

export default API;
