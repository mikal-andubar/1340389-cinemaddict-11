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
    this.emoji = Object.entries(Emojis).find((emoji) => emoji.slice(0, 1).pop() === data[`emotion`]);
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
  }

  /**
   * Преобразует комментарй в структуру для отправки на сервер
   * @return {{}}
   */
  toServerStructure() {
    return {
      "id": this.id,
      "author": this.author,
      "comment": this.text,
      "date": this.date ? this.date.toISOString() : null,
      "emotion": this.emoji ? this.emoji.slice(0, 1).pop() : null,
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

}
