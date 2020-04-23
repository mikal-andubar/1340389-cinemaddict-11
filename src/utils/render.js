import {RENDER_PLACE} from "../constants";

/**
 * Создает и возвращает элемент DOM с переданным содержимым
 * @param {string} template
 * @return {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Функция рендера компонента
 * @param {Element} container
 * @param {{}} component
 * @param {string} place
 */
export const componentRender = (container, component, place = RENDER_PLACE.BEFORE_END) => {
  switch (place) {
    case RENDER_PLACE.AFTER_BEGIN:
      container.prepend(component.getElement());
      break;
    case RENDER_PLACE.BEFORE_END:
      container.append(component.getElement());
      break;
  }
};

/**
 * Удаляет компонент со страницы
 * @param {{}} component
 */
export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

