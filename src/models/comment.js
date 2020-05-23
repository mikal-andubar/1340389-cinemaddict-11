/**
 * Класса адаптера для комментариев
 */
import {Emojis} from "../constants";

export default class Comment {
  /**
   * Конструктор класса
   * @param {{}} data
   */
  constructor(data) {
    this.id = data[`id`];
    this.emoji = Object.entries(Emojis).find((emoji) => emoji[0] === data[`emotion`]);
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
  }

  /**
   * Преобразует комментарй в структуру для отправки на сервер
   * @return {{}}
   */
  toServerStructure() {
    return {
      "comment": this.text,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.emoji ? this.emoji[0] : null,
    };
  }

  /**
   * Преобразует некие данные в структуру комментария
   * @param {{}} data
   * @return {Comment}
   */
  static parseComment(data) {
    return new Comment(data);
  }

  /**
   * Преобразует набор данных в массив фильмов
   * @param {[]} data
   * @return {[]}
   */
  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  /**
   * Клонирует данные комментария
   * @param {Comment} data
   * @return {Comment}
   */
  static clone(data) {
    return new Comment(data.toServerStructure());
  }

}
