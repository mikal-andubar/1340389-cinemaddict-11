import {SHAKE_TIME} from "../constants";

export const shake = (component) => {
  component.getElement().style.animation = `shake ${SHAKE_TIME}ms`;

  setTimeout(() => {
    component.getElement().style.animation = ``;
  }, SHAKE_TIME);
};
