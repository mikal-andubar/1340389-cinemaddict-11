
/**
 * Класса адаптера для фильмов
 */
export default class Movie {
  /**
   * Конструктор класса
   * @param {{}} data
   */
  constructor(data) {
    const filmInfo = data[`film_info`];
    const releaseInfo = filmInfo[`release`];
    const userInfo = data[`user_details`];

    this.id = data[`id`];
    this.title = filmInfo[`title`];
    this.originalTitle = filmInfo[`alternative_title`];
    this.director = filmInfo[`director`];
    this.writers = filmInfo[`writers`];
    this.actors = filmInfo[`actors`];
    this.country = releaseInfo[`release_country`];
    this.releaseDate = new Date(releaseInfo[`date`]);
    this.rating = filmInfo[`total_rating`];
    this.duration = filmInfo[`runtime`];
    this.genres = filmInfo[`genre`];
    this.poster = filmInfo[`poster`];
    this.description = filmInfo[`description`];
    this.age = filmInfo[`age_rating`];
    this.comments = data[`comments`];
    this.isWatched = userInfo[`already_watched`];
    this.isInWatchlist = userInfo[`watchlist`];
    this.isFavorite = userInfo[`favorite`];
    this.watchingDate = userInfo[`watching_date`];
  }

  /**
   * Преобразует фильм в структуру для отправки на сервер
   * @return {{}}
   */
  toServerStructure() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.age,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate,
          "release_country": this.country,
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isInWatchlist,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite,
      }
    };
  }

  /**
   * Преобразует некие данные в структуру фильма
   * @param {[]} data
   * @return {Movie}
   */
  static parseMovie(data) {
    return new Movie(data);
  }

  /**
   * Преобразует набор данных в массив фильмов
   * @param {[]} data
   * @return {[]}
   */
  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  /**
   * Клонирует данные фильма
   * @param {Movie} data
   * @return {Movie}
   */
  static clone(data) {
    return new Movie(data.toServerStructure());
  }
}
