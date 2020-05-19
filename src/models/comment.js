/**
 * Класса адаптера для комментариев
 */
import {Emojis} from "../constants";

export default class Comment {
  /**
   * Конструктор класса
   * @param {[]} data
   */
  constructor(data) {
    this.id = data[`id`];
    this.emoji = Object.entries(Emojis).find((emoji) => emoji[0] === data[`emotion`]);
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
  }

  /**
   * Преобразует некие данные в структуру комментария
   * @param {[]} data
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
